<template>
    <iframe
      id="citygisMap"
      name="citygisMap"
      width="100%"
      height="100%"
      frameborder="no"
      scrolling="no"
      allowtransparency="true"
    ></iframe>
</template>
<script>
// 城地地图组件
/* eslint-disable camelcase */
import commonMixin from "./mixins/commonMixin.js";
import { getUrl } from "@/utils/tools";
import config from '@/config/index'

export default {
  name: "citymap",
  mixins: [commonMixin],
  data() {
    return {
      mapReadyBool: false,
      bridge: null
    };
  },
  inject: ["getGlobalConfig"],
  computed: {},
  methods: {
    // 初始化地图相关
    // 合并iframe页面参数
    mergeMapURL(mapUrl, params) {
      let paramsURl = "?";
      Object.keys(params).forEach(k => {
        paramsURl += k + "=" + params[k].toString() + "&";
      });
      return mapUrl + paramsURl.substring(0, paramsURl.length - 1);
    },
    // 生成唯一Id
    yeildUniqueID() {
        return Number(Math.random().toString().substr(3) + Date.now()).toString(36);
    },
    // 初始化地图
    initCityMap() {
      const mapConfig = this.getGlobalConfig();
      this.citymapClientID = this.yeildUniqueID();// socket通信，客户端id
      this.citymapSceneID = this.yeildUniqueID();// socket通信，场景id
      this.citymapGroupID = this.yeildUniqueID();// socket通信，通信组id
      let that = this;
      let cityMapParams = {// 初始化地图参数
        debug: false,
        maptype: "3d",
        code: mapConfig.screenConfig.districtNo,
        themeid: "Gis",
        sceneID: this.citymapSceneID,
        group: this.citymapGroupID,
        token: mapConfig.screenConfig.token || "noToken"
      };
      mapConfig.screenConfig.mapUrl = mapConfig.screenConfig.mapUrl || config.mapComponentUrl;
      const mapURLSub = getUrl("/", mapConfig.screenConfig.mapUrl);
      let mapURL = this.mergeMapURL(mapURLSub + "WidgetPages/WidgetGIS.html", cityMapParams);
      let cityMapMeunParams = {// 初始化地图菜单参数
        sceneId: this.citymapSceneID,
        code: mapConfig.screenConfig.districtNo,
        group: this.citymapGroupID,
        token: mapConfig.screenConfig.token || "noToken"
      };
      let mapMeunURL = this.mergeMapURL(mapURLSub + "MapUI/mapmeun/mapmeun.html", cityMapMeunParams);
      // eslint-disable-next-line no-undef
      this.bridge = new CityGis.Bridge({
        id: "citygisMap",
        url: mapURL,
        onReady: function () {
                  // this.Invoke({
                  //     ActionName: "userMenu",
                  //     Parameters: JSON.stringify({
                  //         url: mapMeunURL
                  //     })
                  // });
                  that.onMapReady();
              }
      });
      // 兼容原有操作
      window.bridge = this.bridge;
    },
    onMapReady() {
       this.mapReadyBool = true;
       this.$bus.$emit("citymap-ready", this.mapReadyBool);
    },
    mapClickHandle(data) {
       this.$bus.$emit("citymap-click", data);
    },
    // 初始化地图响应事件
    initCityMapEvent() {
      let that = this;
      this.bridge.removeEventListener();
      this.bridge.addEventListener(function (arg) {
        switch (arg.action) {
            case "mapclick":
              that.mapClickHandle(arg.data);
                // 地图点选消息
                break;
            case "ResetMap":
                // 地图重置完成消息
                break;
            case "changeTheme":
                // 地图主题切换消息
                break;
            case "Clear":
                // 地图清空消息
                break;
        }
        // console.log(arg.action + ":" + JSON.stringify(arg.data));
        // 开启websocket通信时开发
      //  window.socketBridge.broadcast({ sceneId: that.citymapSceneID, data: arg, group: that.citymapGroupID });
      }, this);
    },
    // 初始化地图socket服务端对象
    initMapServerSocket() {
      let that = this;
      // eslint-disable-next-line no-undef
      window.socketBridge = new CityGis.MapSocket({
              host: config.mapSocketHost,
              port: config.mapSocketPort,
              clientId: "testmap",
              group: that.citymapGroupID,
              onMessage: (msg) => {
                  if (msg.meta.sceneId === that.citymapSceneID && msg.meta.clientId !== "testmap") {
                      var cmd = msg.data;
                      if (cmd && cmd.ActionName) {
                          this.bridge.Invoke(cmd);
                      } else {
                          console.error("命令格式不正确：" + msg);
                      }
                  } else {
                      console.warn("场景sceneId不正确：" + msg);
                  }
              }
          });
    },
    // 初始化地图socket客户端对象
    initMapClientSocket() {
          // eslint-disable-next-line no-undef
          this.socketClient = new msc.Client(
            {
              host: config.mapSocketHost,
              port: config.mapSocketPort
            },
            this.citymapClientID
          );
          this.socketClient.connect();
          this.socketClient.onConnect(() => {
            console.log("连接成功！");
          });
          this.socketClient.join(this.citymapGroupID);
          this.socketClient.onMessage(msg => {
            if (msg.data.action === "MapReady") {
               console.log(msg);
            } else if (msg.data.action === "mapclick") {
              console.log(msg);
            }
          });
    },
    // socket通信触发命令
    pubMapAPI(commandParams) {
      this.socketClient.pub({
        sceneId: this.citymapSceneID,
        targetClientIds: ["testmap"],
        data: commandParams
      });
    }
  },
  mounted() {
    this.initCityMap();
    this.initCityMapEvent();
    // 开启websockoet地图交互
    // this.initMapServerSocket();
    // this.initMapClientSocket();

    this.$_mapProxy.setBridge(this.bridge);
  },
  beforeDestroy() {

  }
};
</script>
<style scoped>

</style>
