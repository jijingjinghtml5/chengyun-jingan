/**
 * 定义地图操作响应事件
 * 组 和 元素 通过 . 关联
 */

 const MapEvents = {
   // 图层组事件 map-layer-event.{layerEvent} layerInfo
   GROUP_LAYER: "map-layer-event",
   // 图层注册成功
   REGISTER: "register",
   // 图层开启之之前
   BEFORE_OPEN: "beforeOpen",
   // 图层开启之后
   AFTER_OPEN: "afterOpen",
   // 图层关闭之之前
   BEFORE_CLOSE: "beforeClose",
   // 图层开启之后
   AFTER_CLOSE: "afterClose",
   CHANGE_GROUP: "changeGroup",

   // 操作组  op.{操作方法}(layerInfo)
   GROUP_OPERATE: "op",
   LAYER_OPEN: "open",
   LAYER_CLOSE: "close",
   LAYER_SHOW: "show",
   LAYER_HIDE: "hide",
   LAYER_REGISTER: "registerLayer",
   LAYER_REMOVE: "removeLayer",

   // 地图本身事件 bridge 事件
   GROUP_MAP: "map-event",
   // 图层点击事件
   MAP_CLICK: "mapclick",
   // 清空地图
   MAP_CLEAR: "Clear",
   // 重置地图
   MAP_RESET: "ResetMap",
   // 切换地图
   MAP_CHANGE_THEME: "changeTheme",
   // 地图加载完成
   MAP_READY: "mapReady",
   // 不支持的事件
   EVENT_UNSUPPORT: "event-unsupport",
   // 触发事件
   EVENT_TRIGGER: "trigger-event",

   // 地图关联操作
   GROUP_RELATION: "map-relation-operater",
   // 打开关联视频
   WITH_VIDEO: "with-video",
   // 关闭关联视频
   WITHOUT_VIDEO: "without-video"

 };
 export default MapEvents;
