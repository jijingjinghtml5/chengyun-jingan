import { eventProxy } from "@/lib/websocket/eventProxy";
import MapLocationModule from "./Modules/PointLocation.js";
import TrackLayer from "./Modules/TrackLayer.js";
import gridLayer from "./Modules/GridLocation.js";
import streetLayer from "./Modules/StreetLocation.js";
import communityLayer from "./Modules/CommunityLocation.js";
import GeoTransModule from "./Modules/GeoTransModule";
import MapLayer from "./MapLayer";
import MapEvents from "./MapOperateEvent.js";

/**
 * 地图操作代理
 * @methods
 * @method  registerLayer(layerName, desc, groupId, Parameters, actionName, popupConfig)  注册地图图层
 * @method  layerClickHandle(layerName, cb)
 * @method  registerEvent(eventType, cb, layerId)
 * @method  getMap()
 * @method  goToPosition(shLng, shlat)
 * @method  transToShLocal(pointObj) 点位信息 {system:坐标系, latitude:纬度, longitude:经度}
 */
class MapProxy {
  // 手动分组  不会自动恢复
  MANUAL_GROUP = "manual";
  // 地图bridge
  bridge = null;
  map = null;
  // event bus channel
  $bus = null;
  // 标记地图加载完成
  mapReady = false;
  /**
   * 已注册加载的图层
   */
  registerLayers = { // todo 如何退出？？
    // id: obj
  };
  layerIdMap = { // 图层名称到ID的映射   由于地图同一个图层名只能对应一个层 所以后注册的同名层会覆盖前面的层
    // layerName: layerId
  }
  // 最后一次操作的组 组元素为对应的图层id
  lastOperateGroupLayers = [];
  lastOperateGroupId = null;

  mapEventHandleStack = {
    mapclick: [
     // ()=>{}
    ], // 地图点击事件
    ResetMap: [
      // ()=>{},
    ], // 地图重置完成事件
    changeTheme: [], // 切换主题事件
    Clear: [] // 地图清空事件
  };
  // 注册监听的事件
  _eventLayerListneners = [
    MapEvents.AFTER_OPEN,
    MapEvents.BEFORE_CLOSE,
    MapEvents.MAP_CLICK
  ]
  _eventLayerOperateListeners = [
    MapEvents.LAYER_OPEN,
    MapEvents.LAYER_CLOSE,
    MapEvents.LAYER_SHOW,
    MapEvents.LAYER_HIDE
  ]
  _eventProxyOperateListeners = [
    MapEvents.LAYER_REGISTER,
    MapEvents.LAYER_REMOVE

  ]
  // 操作队列 ， 地图的操作会先进队列然后根据 异步处理各个请求
  waitingOperationList = [];

  extendModules = [MapLocationModule, GeoTransModule, TrackLayer, gridLayer, streetLayer, communityLayer];
  _bootstrapModules = [];
  init() {
    this.$bus = eventProxy;
    this.$bus.$on("citymap-ready", () => {
      this.setMapReady(true);
    });
    // TODO 继承多module问题
    this.extendModules.forEach((module, index) => {
      for (let key in module) {
        if (key === "init") {
          const method = "__" + key + "_" + index;
          MapProxy.prototype[method] = module[key];
          this._bootstrapModules.push(method);
        } else {
          MapProxy.prototype[key] = module[key];
        }
      }
    });
    this._bootstrapModules.forEach(methodName => {
      this[methodName]();
    });
    // console.log("map proxy", this.pointLocationLayer);
  }
  // 获取一个新的分组
  getNewGroupId() {
    var date = new Date();
    var ss = date.getSeconds();
    var sss = date.getMilliseconds();
    var context = ss + sss + "" + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10);
    return context;
  }
  // 根据图层id 获取图层
  getLayerById(id) {
    return this.registerLayers[id];
  }
  // 根据图层名称获取图层
  getLayerByName(LayerName) {
    const id = this.layerIdMap[LayerName];
    return this.getLayerById(id);
  }
  /**
     * 注册图层
     * @param {*} layerName   图层名称保持唯一
     * @param {*} desc        图层说明
     * @param {*} groupId     可选 组id 用于把多个图层关联到一个操作
     * @param {*} Parameters  可选 图层生成所需的参数配置 参考城地
     * @param {*} popupConfig 可选 弹窗配置 地图默认点击事件会添加  不添加则不响应点击事件
     * {
     *    component: null,   弹窗模版组件  用于内部定义的弹窗组件  见components/popups  仅限于内部模块使用 第三方请使用popupTemplateUrl
     *    templateUrl: ''    自定义弹窗   使用CustomPopup  内嵌的iframe页面地址, 如果同时设置popupComponent 此参数优先级高
     *    dataFormat: (config, data) => {}  config 为popupConfig   data为点击事件地图获取的数据 args.data中对应的图层数据args.data.{layerName}[0] 此参数配合popupComponent使用
     * }
     * @param {*} actionName  图层操作指令
     * @return {MapLayer}  layer    对应的图层对象
     */
    registerLayer(layerName, desc, groupId = null, Parameters = null, actionName = "ShowData", popupConfig = null) {
      if (!groupId) {
        groupId = this.getNewGroupId();
      }
      let layer = this.getLayerByName(layerName);
      if (layer) {
        layer.setGroupId(groupId);
      } else {
        layer = new MapLayer({
          layerName: layerName,
          desc: desc,
          groupId: groupId
        });
      }
      const layerId = layer.getId();
      this.registerLayers[layerId] = layer;
      this.layerIdMap[layerName] = layerId;

      if (Parameters) {
        layer.setParameters(Parameters);
      }
      if (actionName) {
        layer.setActionName(actionName);
      }
      if (popupConfig) {
        layer.setPopupConfig(popupConfig);
      }

      // layer.setRegisterSnapshot();

      this.$bus.$emit(MapEvents.GROUP_LAYER + "." + MapEvents.REGISTER, layer.toString());
      return layer;
    }
    // 移除图层
    removeLayer(layerId) {
      const layer = this.getLayerById(layerId);
      if (layer) {
        const layerName = layer.getLayerName();
        layer.remove();
        this.registerLayers[layerId] = null;
        delete this.registerLayers[layerId];
        delete this.layerIdMap[layerName];
      }
    }
    // 切换组操作
    onChangeLayerGroup() {
      this.$bus.$on(MapEvents.GROUP_LAYER + "." + MapEvents.CHANGE_GROUP, res => {
        const { id } = res.layerInfo;
        const lastGroupId = res.data;
        // console.log("handle event change group", lastGroupId);

        const layer = this.getLayerById(id);
        layer.handleEvent(MapEvents.BEFORE_CLOSE, lastGroupId);
        layer.$off(null, null, lastGroupId);
      });
    }
    // 打开图层
    onBeforeLayerOpen() {
      // 打开图层之前记录最后一个组的操作
      this.$bus.$on(MapEvents.GROUP_LAYER + "." + MapEvents.BEFORE_OPEN, res => {
        const { groupId } = res.layerInfo;
        if (this.lastOperateGroupId !== groupId && groupId !== this.MANUAL_GROUP) {
          // 回滚上一个组的操作
          // console.log("handle event before open", JSON.stringify(this.lastOperateGroupLayers));
          let id = this.lastOperateGroupLayers.pop();
          while (id) {
            const layer = this.getLayerById(id);
            layer.close();

            id = this.lastOperateGroupLayers.pop();
          }
        }
      });
    }
    onAfterLayerOpen() {
      this.$bus.$on(MapEvents.GROUP_LAYER + "." + MapEvents.AFTER_OPEN, res => {
        const { groupId, id } = res.layerInfo;
        if (this.lastOperateGroupId !== groupId && groupId !== this.MANUAL_GROUP) {
          this.lastOperateGroupId = groupId;
          this.lastOperateGroupLayers.push(id);
          this.lastOperateGroupLayers = Array.from(new Set(this.lastOperateGroupLayers));
        }
      });
    }

    // 执行地图指令
    callBridge(command, op, layerId, params = []) {
      if (this.mapReady) {
        this.bridge.Invoke(command);
      } else {
        this.waitingOperationList.push({
          op: op,
          layerId: layerId,
          params: params
        });
      }
    }

    /**
    * 地图定位
    */
    goToPosition(shLng, shLat) {
      this.callBridge({
        ActionName: "goToPosition",
        Parameters: JSON.stringify({
          positon: {
            x: shLng,
            y: shLat,
            z: 0
          },
          zoom: 20,
          heading: 0,
          tilt: 0,
          hasImg: true
        })
      }, "goToPosition");
    }
    /**
    重置定位点
     */
    clearPosition() {
      this.callBridge({
        ActionName: "Clear",
        "Parameters": {
          "position": true
        }
      }, "clearPosition");
    }
    // 回到全图
    fullExtent() {
      this.callBridge({
        ActionName: "FullExtent"
      }, "clearPosition");
    }
    // 清空地图
    clearMap() {
      this.callBridge({
        ActionName: "Clear"
      }, "clearMap");
    }
    /**
     * 注册响应事件
     * @param {string} eventType   mapclick|ResetMap|changeTheme|Clear
     * @param {*} cb          mapclick {layerName: 'xxxx', cb:(config, data)=>{ .... }},  other cb
     * @param {string} layerId  可选 图层点击事件
     */
    registerEvent(eventType, cb, layerId) {
      // todo  reset
      if (!this.mapEventHandleStack[eventType]) {
        console.log("event type:" + eventType + "do not support");
        this.$bus.$emit(MapEvents.GROUP_MAP + "." + MapEvents.EVENT_UNSUPPORT, { supportList: ["mapclick", "ResetMap", "changeTheme", "Clear"] }, true);
        return false;
      }
      // 设置了图层添加到图层
      const layer = this.getLayerById(layerId);
      if (layer) {
        layer.onClick(cb);
      } else {
        this.mapEventHandleStack[eventType].push(cb);
      }
    };

    // 初始化地图事件监听
    _initEventListener() {
      this.bridge.removeEventListener();
      // 初始化地图监听
      this.bridge.addEventListener((args) => {
        // console.log("map event", args);
        // 广播地图点击事件
        this.$bus.$emit(MapEvents.GROUP_MAP + "." + MapEvents.EVENT_TRIGGER, args, true);
        const action = args.action;
        // 地图点击事件 对每个图层单独触发点击事件
        if (action === "mapclick") {
           for (let layerName in args.data) {
             const layer = this.getLayerByName(layerName);
             layer.click(args.data[layerName][0]);
           }
        }
        const handles = this.mapEventHandleStack[action];

        // 已注册的事件响应
        handles.forEach(cb => {
          cb(args.data);
        });
      });
    };
    // 初始化图层监听
    _initLayerEventListener() {
      // 图层监听事件
      this._eventLayerListneners.forEach(event => {
        this.$bus.$on(MapEvents.GROUP_LAYER + "." + event, res => {
          const { id, groupId } = res.layerInfo;

          const layer = this.getLayerById(id);
          if (layer) {
            layer.handleEvent(event, groupId, res.data);
          }
        });
      });
      // 图层操作
      this._eventLayerOperateListeners.forEach(event => {
        this.$bus.$on(MapEvents.GROUP_OPERATE + "." + event, data => {
          const { id, groupId } = data;
          const layer = this.getLayerById(id);
          if (groupId == layer.getGroupId()) {
            layer[event]();
          }
        });
      });
      // 代理操作
      this._eventProxyOperateListeners.forEach(event => {
        this.$bus.$on(MapEvents.GROUP_OPERATE + "." + event, data => {
          try {
            this[event](...data);
          } catch (error) {
            console.log(error);
          }
        });
      });
    }
    // 地图加载完成之后  执行这期间产生的操作
    _initOperates() {
      // console.log("map proxy", this.waitingOperationList);
      this.waitingOperationList.forEach(item => {
        const { layerId, op, params } = item;
        const layer = this.getLayerById(layerId);
        if (layer) {
          layer[op](...params);
        } else {
          this[op](...params);
        }
      });
      this.waitingOperationList = [];
    }
    // 获取地图组件对象
    getMap() {
      return this.map;
    }
    // 设置地图通信bridge 对象  用于给地图服务发送指令
    setBridge(bridge) {
      this.bridge = bridge;
    }
    // 设置地图组件对象 用于操作地图弹窗等
    setMap(map) {
      this.map = map;
    }
    // 设置地图加载完成状态
    setMapReady(status) {
      this.mapReady = status;
      this._initEventListener();

      this._initLayerEventListener();

      this._initOperates();

      // 自动清理上一组的图层
      this.onBeforeLayerOpen();
      this.onAfterLayerOpen();
      this.onChangeLayerGroup();
    }
}
export const mapProxy = new MapProxy();
export default {
  install: function(Vue, options) {
    mapProxy.init(options);

    Vue.$_mapProxy = mapProxy;
    Vue.prototype.$_mapProxy = mapProxy;
  }
};
