/**
地图点定位功能
周边人员
周边视频
* @method pointLocation()  点定位
*/

import { getUrl } from "@/utils/tools";
import MapEvents from "../MapOperateEvent";

import { getAroundPeople } from "../api";
import SHcoordinateUtil from "../coordUtils/SHcoordinateUtils.js";
import ZampCoordsUtils from "../coordUtils/ZampCoordsUtils.js";

 const MapLocationModule = {
    aroundPeoplePointImg: "/mapIcon/singlePawn.png", // 周边人员图标
    aroundPeopleLayerName: "aroundPeopleLayer", // 周边人员图层,
    pointLocationLayerName: "pointLocationLayer", // 点定位图层

    pointLocationLayer: null, // 周边人员图层,
    aroundPeopleLayer: null, // 点定位图层

    init() {
      this.pointLocationLayer = this._registerPointLocationLayer();
      this.aroundPeopleLayer = this._registerAroundPeopleLayer();
      // console.log("map proxy MapLocationModule init");
    },
   /**
      * 定位点
      * @param {*} pointData    点位信息 需要包含{lng: '', lat: '', crs: 'SH', ...}
      lng 经度
      lat 纬度
      crs “WGS84”  ----------- 注释：“GPS坐标-国家2000坐标系”
          “GCJ02”  ----------- 注释：“高德地图-腾讯地图-谷歌中国地图坐标”
          “BD09”  ----------- 注释：“百度地图坐标”
          “SH”  ----------- 注释：“上海城建坐标”
      * @param {*} popupConfig  弹窗配置
      * @param {*} pointImg     点位图标
      * @param {*} withPeople   开启周边人员
      * @param {*} withVideo    开启周边视频
      * @return {MapLayer}  pointLocationLayer 点定位附加图层
      */
    pointLocation(pointData, pointImg, groupId, withPeople = true, withVideo = true) {
      if (!groupId) {
        groupId = this.getNewGroupId();
      }

      const { lng, lat, crs } = pointData;
      const [shLng, shLat] = this._getShLocal(lng, lat, crs);

      if (pointImg) {
        // 定制定位点图标
        this.pointLocationLayer.setParameters({
          symbol: {
            type: "picture-marker",
            url: this.getImageUrl(pointImg),
            width: "30px",
            height: "30px"
          }
        }, "renderer");
      } else {
        this.pointLocationLayer.setParameters({
          symbol: {
            type: "simple-marker",
            size: 25,
            color: [0, 255, 0],
            outline: {
              color: "#ffffff",
              width: "2px"
            }
          }
        }, "renderer");
      }
      this.getMap()._closePopup();
      this.pointLocationLayer.setGroupId(groupId).setParameters({
        "data": {
          "content": [{
            ...pointData,
            lng: shLng,
            lat: shLat
          }],
          "parsegeometry": "function(item){return {x:item.lng, y:item.lat}}"
        }
      }).onClose(() => {
        this.clearPosition();

        if (withPeople) {
          this.aroundPeopleLayer.close();
        }
        if (withVideo) {
          this.withoutVideo();
        }
      }, "_moduel_location_auto").open();

      // 点定位
      this.goToPosition(shLng, shLat);

      if (withPeople) {
        this.withAroundPeople(lng, lat, crs, groupId);
      }

      if (withVideo) {
         this.withVideo(lng, lat, crs, groupId);
      }

      return this.pointLocationLayer;
     },
    /**
      * 重置点定位功能
      */
    resetPointLocation() {
      this.pointLocationLayer.close();
    },
    /**
     //获取坐标点周边人员
      * @param {*} lng   经度
      * @param {*} lat   纬度
      * @param {*} crs   坐标系
      */
    withAroundPeople(lng, lat, crs, groupId) {
      const [wgsLng, wgsLat] = this._getWGS(lng, lat, crs);
      let distanceParam = wgsLng + "," + wgsLat + "," + window.$config.aroundPeopleDistance;
      getAroundPeople(distanceParam).then(data => {
        this.aroundPeopleLayer.setGroupId(groupId)
        .setParameters({
          "data": {
            "content": data.list,
            "parsegeometry": "function(item){return {x:item.lng, y:item.lat}}"
          }
        }).setPopupConfig({
          component: "soldier",
          dataFormat: res => {
            return {
              rawData: res,
              info: res
            };
          }
        })
        .open();
      });
    },
    // 周边视频
    /**
     *
     * @param {*} lng
     * @param {*} lat
     * @param {*} crs
     */
    withVideo(lng, lat, crs) {
      const [shLng, shLat] = this._getShLocal(lng, lat, crs);
      this.$bus.$emit(MapEvents.GROUP_RELATION + "." + MapEvents.WITH_VIDEO, { data: { lng: shLng, lat: shLat }, relationLayInfo: this.pointLocationLayer.toString() });
    },
    // 关闭周边视频
    withoutVideo() {
      this.$bus.$emit(MapEvents.GROUP_RELATION + "." + MapEvents.WITHOUT_VIDEO);
    },
    // 关闭周边人员
    withoutAroundPeople() {
      this.aroundPeopleLayer.close();
    },
     // 周边人员图层
     _registerAroundPeopleLayer() {
       return this.registerLayer(this.aroundPeopleLayerName, "点位周边人员", null, {
        "name": this.aroundPeopleLayerName,
        "type": "point",
        "mode": "replace",
        "data": {
          "content": [],
          "parsegeometry": "function(item){return {x:item.lng, y:item.lat}}"
        },
        "legendVisible": false,
        "popupEnabled": false,
        "isFiltered": false,
        "isLocate": false,
        "renderer": {
          type: "simple",
          label: "点位周边人员",
          symbol: {
            type: "picture-marker",
            url: getUrl(this.aroundPeoplePointImg),
            width: "36px",
            height: "36px"
          }
        }
      });
     },
    /**
     *  注册定位点 图层
    */
     _registerPointLocationLayer(pointImg) {
      let cmd = {
        "name": this.pointLocationLayerName,
        "type": "point",
        "mode": "replace",
        "data": {
          "content": [],
          "parsegeometry": "function(item){return {x:item.x, y:item.y}}"
        },
        "legendVisible": false,
        "popupEnabled": false,
        "isFiltered": false,
        "isLocate": false,
        "renderer": {
          type: "simple",
          label: "定位点-附加点",
          symbol: {
            type: "simple-marker",
            size: 25,
            color: [0, 255, 0],
            outline: {
              color: "#ffffff",
              width: "2px"
            }
          }
        }
      };
      return this.registerLayer(this.pointLocationLayerName, "定位点-附加点", null, cmd);
     },
     /**
     转换成城建坐标
      */
     _getShLocal(lng, lat, crs) {
       switch (crs) {
         case "WGS84":
          return SHcoordinateUtil.WGStoSH([parseFloat(lng), parseFloat(lat)]);
         case "GCJ02":
          return SHcoordinateUtil.GCJtoSH([parseFloat(lng), parseFloat(lat)]);
         case "BD09":
          return SHcoordinateUtil.BDtoSH([parseFloat(lng), parseFloat(lat)]);
         default:
          return [lng, lat];
       }
     },
     _getWGS(lng, lat, crs) {
       switch (crs) {
         case "SH":
          return SHcoordinateUtil.SHtoWGS([parseFloat(lng), parseFloat(lat)]);
         case "GCJ02":
          return ZampCoordsUtils.GCJtoWGS([parseFloat(lng), parseFloat(lat)]);
         case "BD09":
          return ZampCoordsUtils.BDtoWGS([parseFloat(lng), parseFloat(lat)]);
         default:
          return SHcoordinateUtil.SHtoWGS([parseFloat(lng), parseFloat(lat)]);
       }
     },
     getImageUrl(pointImg) {
       const reg = /^http(s)?:\/\//;
       return reg.test(pointImg) ? pointImg : getUrl(pointImg);
     }
 };

 export default MapLocationModule;
