<template>
  <div class="mapToolsContainer" >
     <div v-for="(item,index) in mapToolsData" :key="index"  style="position:relative" >
         <div class="btnLable" v-show="labelActives[index]">{{btnActives[index]?functionDatas[item.name].closeLable:functionDatas[item.name].openLable}}</div>
         <div v-if="functionDatas[item.name].img !== undefined" class="btnClass btnClassImg" @click="btnClick(item,index)" @mouseover="btnMouseOver(index)" @mouseout="btnMouseOut(index)">
          <img v-if="btnActives[index]" :src="functionDatas[item.name].img_fill" />
          <img v-else :src="functionDatas[item.name].img" />
         </div>
         <div v-else :class="{btnClass:true, btnClassActive:btnActives[index]}" @click="btnClick(item,index)" @mouseover="btnMouseOver(index)" @mouseout="btnMouseOut(index)">
           <span v-if="functionDatas[item.name].number !== undefined" class="btn-number">{{functionDatas[item.name].number}}</span>
           <span v-if="functionDatas[item.name].number === undefined" class="iconfont  mapControlIcon"  :class="functionDatas[item.name].iconClass" ></span>
         </div>
     </div>
  </div>
</template>
<script>
import { getBarData } from '../../api.js'
export default {
  components: {},
  props: {
    mapReadyBool: {
      type: Boolean,
      default: false
    },
    mapToolsData1: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  name: "mapTools",
  // inject: ["getGlobalConfig"],
  data() {
    return {
      labelActives: [],
      btnActives: [],
      mapToolsData: [
        // { "name": "全图", "status": false, "single": true },
        { "name": "搜索", "status": false },
        { "name": "全图", "status": false },
        { "name": "街道边界", "status": false },
        { "name": "网格边界", "status": false },
        { "name": "居委边界", "status": false },
        { "name": "建筑白模", "status": false },
        { "name": "建筑精模", "status": false },
        { "name": "底图切换", "status": false }
      ],
      functionDatas: {
        "搜索": {
          img: require('@/assets/images/search.png'),
          img_fill: require('@/assets/images/search_fill.png'),
          openFunction: "openSearchPopup",
          closeFunction: "closeSearchPopup",
          openLable: "打开搜索场景",
          closeLable: "关闭搜索场景"
        },
        "全图": {
          number: 1,
          openFunction: "fullExtent",
          closeFunction: "initPosition",
          openLable: "全图",
          closeLable: "初始化视角"
        },
        "街道边界": {
          number: 14,
          openFunction: "openStreetLayer",
          closeFunction: "closeStreetLayer",
          openLable: "打开街道边界",
          closeLable: "关闭街道边界"
        },
        "网格边界": {
           number: 85,
           openFunction: "openGridLayer",
           closeFunction: "closeGridLayer",
           openLable: "打开网格边界",
           closeLable: "关闭网格边界"
        },
        "居委边界": {
           number: 267,
           openFunction: "openJuweiLayer",
           closeFunction: "closeJuweiLayer",
           openLable: "打开居委会边界",
           closeLable: "关闭居委会边界"

        },
        "建筑白模": {
          iconClass: "icon-baimo",
          openFunction: "openSimpleModelLayer",
          closeFunction: "closeSimpleModelLayer",
          openLable: "打开建筑白模",
          closeLable: "关闭建筑白模"
        },
        "建筑精模": {
          iconClass: "icon-jingmo",
          openFunction: "openDetailModelLayer",
          closeFunction: "closeDetailModelLayer",
          openLable: "打开建筑精模",
          closeLable: "关闭建筑精模"
        },
        "底图切换": {
          iconClass: "icon-weixing",
          openFunction: "openRemoteScenseLayer",
          closeFunction: "closeRemoteScenseLayer",
          openLable: "打开卫星底图",
          closeLable: "关闭卫星底图"
        }
      }
    };
  },
  watch: {
     btnActives: {
       handler(val) {
       },
       deep: true

     }
  },
  created() {
    getBarData().then(res => {
      this.functionDatas['街道边界'].number = res.street
      this.functionDatas['网格边界'].number = res.grid
      // this.functionDatas['居委边界'].number = res.juwei
    })
  },
  methods: {
    // 按钮执行函数 ------------start
    initPosition() {
       let position = {
          "ActionName": "goToPosition",
          "Parameters": {
            "positon": {
              "x": -1733,
              "y": -917,
              "z": 0
            },
            "heading": 19,
            "tilt": 63,
            "hasImg": false,
            "zoom": 20,
            "isRotation360": false
          }
        };
        window.bridge.Invoke(position);
    },
    onMapReady() {
      // this.initPosition();
      // this.openSimpleModelLayer();
    },
    tabMapLayer(name, status) {
       let cmd = {
            "ActionName": "LayerVisible",
            "Parameters": [
              {
                "name": name,
                "visible": status,
                "legendVisible": false,
                 "popupEnabled": false

              }
            ]
          };
      window.bridge.Invoke(cmd);
    },
    tabModelLayer(name, status) {
       let cmd = {
            "ActionName": "themeLayer",
            "Parameters":
              {
                "name": name,
                "visible": status,
                 "popupEnabled": false,
                "legendVisible": false
              }
          };
      window.bridge.Invoke(cmd);
    },
    openRemoteScenseLayer() {
      this.$bus.$emit('click-satellite-basemap')
       /* let cmd = {
                "ActionName": "ChangeMapTheme",
                "Parameters": {
                  "mapthemeid": "scyxbasemap"
                }
              };
      window.bridge.Invoke(cmd); */
    },
    closeRemoteScenseLayer() {
      this.$bus.$emit('click-satellite-basemap')
      /* let cmd = {
                "ActionName": "ChangeMapTheme",
                "Parameters": {
                  "mapthemeid": "basetheme"
                }
              };
      window.bridge.Invoke(cmd); */
    },
    openDetailModelLayer() {
      this.tabModelLayer("建筑精模", true);
    },
    closeDetailModelLayer() {
       this.tabModelLayer("建筑精模", false);
    },
    openSimpleModelLayer() {
      this.tabModelLayer("建筑白模", true);
      setTimeout(() => {
        let position = {
        "ActionName": "goToPosition",
        "Parameters": {
          "positon": {
            "x": -1389.0041669108134,
            "y": -1171.9187097654974,
            "z": 0
          },
          "heading": 19,
          "tilt": 63,
          "hasImg": false,
          "zoom": 20,
          "isRotation360": false
        }
      };
      window.bridge.Invoke(position);
      }, 5000)
    },
    closeSimpleModelLayer() {
      this.tabModelLayer("建筑白模", false);
      this.initPosition()
    },
    openSearchPopup() {
      this.$bus.$emit('showSearch', true)
    },
    closeSearchPopup() {
      this.$bus.$emit('showSearch', false)
    },
    openStreetLayer() {
      this.useMapStatus();
      this.openBoundary("townBoundaryLayer", "街道乡镇");
      // this.tabMapLayer("街道乡镇组", true);
    },
    openBoundary(layerName, boundaryName) {
      const cmd = {
        name: layerName,
        type: "layer",
        isLocate: false,
        legendVisible: false,
        popupEnabled: false,
        data: {
          layers: {
            name: boundaryName
          }
        },
        renderer: {
            type: "simple",
                symbol: {
                  type: "simple-fill",
                  color: [105, 240, 174, 0],
                  style: "solid",
                  outline: {
                    color: [105, 240, 174, 1],
                    width: 3
                  }
                }
        }
      };
      const commandParams = {
        ActionName: "ShowData",
        Parameters: JSON.stringify(cmd)
      };
      window.bridge.Invoke(commandParams);
    },
    removeLayer (layerName) {
      const commandParams = {
        ActionName: "doRemoveShowData",
        Parameters: JSON.stringify([
          layerName
        ])
      };
      window.bridge.Invoke(commandParams);
    },
    openJuweiLayer() {
      this.useMapStatus();
      this.openBoundary("juweiBoundaryLayer", "居委会");
    },
    closeJuweiLayer() {
       this.removeLayer("juweiBoundaryLayer");
    },
    closeStreetLayer() {
      this.removeLayer("townBoundaryLayer");
    },
    openGridLayer() {
      this.useMapStatus();
      this.openBoundary("gridBoundaryLayer", "责任网格");
    },
    closeGridLayer() {
       this.removeLayer("gridBoundaryLayer");
    },
    useMapStatus() {
         if (this.btnActives[5]) {
           this.btnActives[5] = !this.btnActives[5];
           this.closeSimpleModelLayer();
         }
          if (this.btnActives[6]) {
           this.btnActives[6] = !this.btnActives[6];
           this.closeDetailModelLayer();
         }
        if (this.btnActives[7]) {
           this.btnActives[7] = !this.btnActives[7];
           this.closeRemoteScenseLayer();
         }
         if (!this.btnActives[1]) {
           this.btnActives[1] = !this.btnActives[1];
         }
         this.fullExtent();
    },

    fullExtent() {
      let cmd = {
                "ActionName": "FullExtent"
              };
      window.bridge.Invoke(cmd);
    },
    // ------------------------end
    btnMouseOver(index) {
      this.labelActives[index] = true;
      this.labelActives = [...this.labelActives];
    },
    btnMouseOut(index) {
      this.labelActives[index] = false;
      this.labelActives = [...this.labelActives];
    },
    btnClick(item, index) {
      if (item.single) {
          this[this.functionDatas[item.name]["openFunction"]]();
         this.$emit("LayerChange", { status: this.btnActives[index], item: item });
         return;
      }
      this.btnActives[index] = !this.btnActives[index];
      this.btnActives = [...this.btnActives];
      if (this.btnActives[index]) {
          this[this.functionDatas[item.name]["openFunction"]]();
      } else {
           this[this.functionDatas[item.name]["closeFunction"]]();
      }
      this.$emit("LayerChange", { status: this.btnActives[index], item: item });
    }
  },
  mounted() {
      this.mapToolsData.forEach(e => {
        this.btnActives.push(e.status);
      });
      this.mapToolsData.forEach(e => {
        this.labelActives.push(false);
      });
       this.$bus.$on("citymap-ready", this.onMapReady);
       this.$bus.$on("map-close-model", () => {
         if (this.btnActives[4]) {
           this.btnActives[4] = !this.btnActives[4];
           this.closeSimpleModelLayer();
         }
          if (this.btnActives[5]) {
           this.btnActives[5] = !this.btnActives[5];
           this.closeDetailModelLayer();
         }
         if (this.btnActives[6]) {
           this.btnActives[6] = !this.btnActives[6];
           this.closeRemoteScenseLayer();
         }
       });
       this.$bus.$on("map-full-extent", () => {
         if (!this.btnActives[0]) {
           this.btnActives[0] = !this.btnActives[0];
         }
         this.fullExtent();
       });
  }
};
</script>
<style lang="scss" scoped>
.btnLable::before{
  content: " ";
  display:block;
  border-width:8px;
  position:absolute;
  right:-17px;
  top:10px;
  /* left:155px; */
  border-style:solid dashed dashed;
  border-color:transparent transparent transparent #4e78a4;
  font-size:0;
  pointer-events: none;
  line-height:0;
}
.btnLable{
  user-select: none;
  position: absolute;
  font: 24px sans-serif;
  line-height:34px;
  padding: 4px;
  white-space: nowrap;
  border-radius:5px;
  border: 1px solid #4e78a4;
  background-color: rgba(#0f2e60, 1);
  color: #fff;
  right:72px;
  top: 10px;
  box-sizing: border-box;
}
.btnClassActive{
  background-color: rgba(#0f2e60, 1) !important;
  color:#ffffff !important;
   border: 1px solid #2E9BCF !important;
}
.btnClass{
  background-color: rgba(#2573EF, 0.4);
  border: 1px solid #2573EF;
  z-index:9999;
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
  color:#92B9F7;
  cursor: pointer;
  &.btnClassImg {
    background-color: transparent;
    border: 0;
    &:hover {
      border: 0;
      background-color: transparent;
    }
  }
  img {
    display: block;
    width: 60px;
    height: 60px;
  }
}
.btnClass:hover{
  background-color: rgba(#0f2e60, 1);
  border: 1px solid #ffffff;

}
.mapToolsContainer {
  position: absolute;
  z-index:999;
  bottom: 0.1rem;
  right: 6.3rem;
}
.btn-number{
  user-select: none;
  display: block;
  width: 100%;
  height: 100%;
  text-align:center;
  font-size: 30px;
  font-weight: bold;
  line-height: 60px;
}
.mapControlIcon{
  display: block;
  width: 100%;
  height: 100%;
  text-align:center;
  font-size: 40px;
  line-height: 60px;
}
</style>
