/**
 * 地图图层操作
 */
import { mapProxy } from "./MapProxy";
import MapEvents from "./MapOperateEvent";

class MapLayer {
  layerName = null;
  desc = null;

  params = {
    ActionName: "showData",
    Parameters: {}
  };
  paramsKeys = ["name", "type", "mode", "data", "isLocate", "renderer", "legendVisible"];

  popupConfig = {};
  groupId = null;

  _proxy = null;
  // 图层编号
  _id = null;

  // 事件回调
  _eventHandles = {
    /* groupId: {
      event: {id: callback}
    }
    */
  };

  _registerSnapshot = {};

  constructor(config) {
    this._id = this._generateLayerId();
    this.init(config);

    this._proxy = mapProxy;
  }

  init(config) {
    for (let key in config) {
      this[key] = config[key];
    }
  }

  // 设置组id
  setGroupId(id) {
    if (this.groupId && this.groupId != id) {
      this.$emit(MapEvents.CHANGE_GROUP, this.groupId);
    }
    this.groupId = id;
    return this;
  }
  setActionName(ActionName) {
    this.params.ActionName = ActionName;
    return this;
  }
  setPopupConfig(config) {
    this.popupConfig = config;
    // 添加点击事件
    this.onClick((data) => { // data 点击事件附带图层数据 config 图层弹窗配置
      let { component, templateUrl, dataFormat } = this.popupConfig;
      let popData = null;
      if (templateUrl) {
         component = "CustomPopup";
         popData = {
           templateUrl: templateUrl,
           params: data
         };
      } else {
         if (dataFormat) {
             popData = dataFormat(data);
         } else {
             popData = data;
         }
      }

      this._proxy.getMap()._openPopup(component, popData);
    }, "_popup_click_auto");
    this.onClose(() => {
      this._proxy.getMap()._closePopup();
    }, "_popup_close_auto");
    return this;
  }
  /***
   * 更新地图指令数据
   */
  setParameters(params, key) {
    if (key && this.paramsKeys.includes(key)) {
      this.params.Parameters[key] = Object.assign(this.params.Parameters[key] || {}, params);
    } else if (!key) {
      this.params.Parameters = Object.assign(this.params.Parameters, params);
    } else {
      throw new Error("error params key ");
    }
    return this;
  }
  getGroupId() {
    return this.groupId;
  }
  getId() {
    return this._id;
  }
  getLayerName() {
    return this.layerName;
  }
  getActionName() {
    return this.params.ActionName;
  }
  getParameters() {
    return this.Parameters;
  }
  getPopupConfig() {
    return this.popupConfig;
  }

  /**
   * 图层点击
   * @param {Object} data  地图返回的图层点数据
   */
  click(data) {
    this.$emit(MapEvents.MAP_CLICK, data);
  }
  // 打开图层 主要用于 showData 等指令
  open() {
    this.$emit(MapEvents.BEFORE_OPEN);

    // this.params.Parameters.name = this.layerName;
    this._proxy.callBridge({
      ActionName: this.params.ActionName,
      Parameters: JSON.stringify(this.params.Parameters)
    }, "open", this._id);

    this.$emit(MapEvents.AFTER_OPEN);
  }
  // 关闭open 打开的图层
  close() {
    this.$emit(MapEvents.BEFORE_CLOSE);
    this._proxy.callBridge({
      ActionName: "doRemoveShowData",
      Parameters: JSON.stringify([
        this.layerName
      ])
    }, "close", this._id);
    this.$emit(MapEvents.AFTER_CLOSE);

    // this._resetToRegisterSnaoshot();
  }
  /**
   *
   * @param {Object} cmd
   */
  closeOrigin(cmd) {
    this.$emit(MapEvents.BEFORE_CLOSE);
    this._proxy.callBridge(cmd, "closeOrigin", this._id);
    this.$emit(MapEvents.AFTER_CLOSE);

    // this._resetToRegisterSnaoshot();
  }
  // 显示图层 主要用于 打开地图基础图层
  show() {
    this.$emit(MapEvents.BEFORE_OPEN);
    this._proxy.callBridge({
      ActionName: "LayerVisible",
      Parameters: JSON.stringify({
        "name": this.layerName, // 图层名称
        "visible": true,
        "legendVisible": true,
        "popupEnabled": false
      })
    }, "show", this._id);
    this.$emit(MapEvents.AFTER_OPEN);
  }
  // 隐藏 关闭show展开的图层
  hide() {
    this.$emit(MapEvents.BEFORE_CLOSE);
    this._proxy.callBridge({
      ActionName: "LayerVisible",
      Parameters: JSON.stringify({
        "name": this.layerName, // 图层名称
        "visible": false,
        "legendVisible": true,
        "popupEnabled": true
      })
    }, "hide", this._id);
    this.$emit(MapEvents.AFTER_CLOSE);
  }

  // 发送消息
  $emit(event, data) {
    this._proxy.$bus.$emit(MapEvents.GROUP_LAYER + "." + event, {
      layerInfo: this.toString(),
      data: data,
      map: "map-main" // 预留支持多地图
    }, true);
  }

  // 处理当前图层事件 如何解决重复注册的问题
  $on(event, callback, id) {
    if (!id) {
      id = this._id;
    }
    let events = this.getGroupEvents();
    if (!events[event]) {
      events[event] = {};
    }
    events[event][id] = callback;
    return this;
  }
  // 解除事件  event 事件类型  id 为绑定事件时设置的唯一编码 可以不传
  $off(event, id, groupId) {
    if (!groupId) {
      groupId = this.groupId;
    }
    let events = this.getGroupEvents(groupId);
    if (event) {
      if (events[event]) {
        if (id) {
          delete this._eventHandles[groupId][event][id];
        } else {
          this._eventHandles[groupId][event] = {};
        }
      }
    } else {
      delete this._eventHandles[groupId];
    }

    return this;
  }

  // 图层打开响应
  onOpen(callback, id) {
    return this.$on(MapEvents.AFTER_OPEN, callback, id);
  }
  // 图层关闭响应
  onClose(callback, id) {
    return this.$on(MapEvents.BEFORE_CLOSE, callback, id);
  }
  // 图层点击响应
  onClick(callback, id) {
    return this.$on(MapEvents.MAP_CLICK, callback, id);
  }

  getGroupEvents(groupId) {
    if (!groupId) {
      groupId = this.groupId;
    }
    let events = this._eventHandles[groupId];
    if (!events) {
      this._eventHandles[groupId] = {};
      events = this._eventHandles[groupId];
    }
    return events;
  }
  handleEvent(event, groupId, data) {
    const events = this.getGroupEvents(groupId);
    // console.log("handle event res", groupId, event, JSON.stringify(this._eventHandles));

    if (events[event]) {
      for (let id in events[event]) {
        // console.log("handle event do ", groupId, event, id);
        events[event][id](data);
      }
    }
  }

  remove() {
    this._proxy = null;
    this.params = {};
    this._eventHandles = {};
  }
  setRegisterSnapshot() {
    const reg = /^_/;
    Object.getOwnPropertyNames(this).forEach(property => {
      if (!reg.test(property)) {
        this._registerSnapshot[property] = this[property];
      }
    });
  }
  _resetToRegisterSnaoshot() {
    if (this._registerSnapshot) {
      for (let property in this._registerSnapshot) {
        this[property] = this._registerSnapshot[property];
      }
    }
  }

  // 生成图层id
  _generateLayerId() {
    var date = new Date();
    var ss = date.getSeconds();
    var sss = date.getMilliseconds();
    var context = "L" + ss + sss + "" + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10);
    return context;
  }
  toString() {
    return {
      id: this._id,
      name: this.layerName,
      groupId: this.groupId,
      popupConfig: this.popupConfig,
      desc: this.desc
    };
  }
}

export default MapLayer;
