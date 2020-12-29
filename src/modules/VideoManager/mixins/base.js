import MapEvents from "@/lib/MapProxy/MapOperateEvent";
import { getVideoList, getVideosByArea } from "../api";
import { getUrl, thousandCentimeter } from "@/utils/tools";
export default {
  inject: ["getGlobalConfig", "createFnForCalcRealPx"],
  data() {
    return {
      loading: false,
      areaLoading: false,
      groups: [],
      selections: [],
      currentMode: "",
      actionsPanelVisible: false,
      mouseEnterActionsPanel: false,
      playStatus: false,
      playStatusTimer: null,
      currentPlayOption: {
        interval: 0, // 秒
        pageSize: 0, // 每页大小
        currentPage: 0, // 当前播放页
        totalPage: 0 // 总页
      },
      defaultLayoutConfig: {
        colNum: 48,
        marginHorizontal: this.createFnForCalcRealPx(0.2),
        marginVertical: this.createFnForCalcRealPx(0.2),
        playInterval: 60000,
        layout: []
      },
      // 周边半径
      surroundRadius: 500,
      currentLayoutConfig: null,
      rawVideos: {},
      videosByArea: [],
      currentVideos: [],
      pageVideos: [],
      videoIndexForClickMap: -1,
      videoStatus: "normal", // 正常还是周边视频
      videoLayerStatus: true, // 地图图层状态
      layerName: "videoLayer", // 地图视频撒点图层
      currentMapGroupId: this.$_mapProxy.MANUAL_GROUP // 周边视频当前操作组,
    };
  },
  computed: {
    playIcon() {
      return this.playStatus ? "el-icon-video-pause" : "el-icon-video-play";
    },
    statusText() {
      return this.videoLayerStatus ? "开" : "关";
    },
    toggleClass() {
      return this.videoLayerStatus ? "" : "close";
    },
    currentRawVideos() {
      return this.rawVideos[this.currentMode] || [];
    }
  },
  methods: {
    registerVideoLayer() {
      this.mapLayer = this.$_mapProxy.registerLayer(this.layerName, "视频图层", this.currentMapGroupId)
      .setParameters({
        "name": this.layerName,
        "type": "point",
        "mode": "replace",
        "data": {
          "content": [],
          "parsegeometry": "function(item){return {x:item.lng, y:item.lat}}"
        },
        "legendVisible": true,
        "popupEnabled": false,
        "isFiltered": true,
        "isLocate": false,
        "renderer": {
          type: "simple",
          label: "周边视频",
          symbol: {
            type: "picture-marker",
            url: getUrl("/mapIcon/playVideo.png"),
            width: "48px",
            height: "48px"
          }
        }
      }).setPopupConfig({
        component: "video"
      });
      this.$once("hook:beforeDestroy", () => {
        this.$_mapProxy.removeLayer(this.mapLayer.getId());
      });
    },
    handleClickForToggleVideoLayer(status) {
      console.log("图层操作", status);
      this.videoLayerStatus = status !== undefined ? status : !this.videoLayerStatus;
      // console.log("打开图层", this.videoLayerStatus, this.currentVideos);
      if (this.videoLayerStatus) {
        console.log("打开图层");
        this.mapLayer.setParameters({
          // name:
          "data": {
            "content": this.currentVideos,
            "parsegeometry": "function(item){return {x:item.lng, y:item.lat}}"
          }
        }).$off(MapEvents.MAP_CLICK, "video-click-point").onClick(item => {
          this.handleClickForMapVideo(item);
        }, "video-click-point").open();
      } else {
        console.log("关闭图层");
        this.mapLayer.close();
      }
    },
    // 地图点击视频 添加到视频播放窗口
    handleClickForMapVideo(item) {
      console.log("当前点击视频", item);
      if (this.currentPlayOption.pageSize < 1) return false;
      const isExist = this.pageVideos.some(video => video.code === item.code);
      if (isExist) {
        return false;
      }
      let currentIndex = this.videoIndexForClickMap;
      this.videoIndexForClickMap = ++currentIndex % this.currentPlayOption.pageSize;
      console.log("索引", this.videoIndexForClickMap);
      this.pageVideos.splice(this.videoIndexForClickMap, 1, item);
    },
    addListenersFromAnotherModules() {
      const handleVideoStop = () => {
        this.handleClickForToggleAutoSwitch(false);
      };

      const handleClickForMapPeripheralVideo = res => {
        console.log("周边视频", res);
        if (!res.data.lat || !res.data.lng) return false;
        this.currentMapGroupId = res.relationLayInfo.groupId;
        this.relationLayInfo = res.relationLayInfo;
        this.handleClickForOpenPeripheralVideo({
          ...res.data,
          radius: this.surroundRadius
        });
      };

      const changeScene = scene => {
        const flag = this.selections.some(d => {
          return d.value.indexOf(scene) !== -1;
        });
        if (flag) {
          this.currentMode = scene;
          this.handleSelectForChangeMode();
        }
      };

      this.$bus.$on("videoStop", handleVideoStop);
      // 周边视频相应事件
      this.$bus.$on(MapEvents.GROUP_RELATION + "." + MapEvents.WITH_VIDEO, handleClickForMapPeripheralVideo);
      this.$bus.$on(MapEvents.GROUP_RELATION + "." + MapEvents.WITHOUT_VIDEO, this.callbackAfterClosePeripheralVideo);

      // 响应切换场景
      this.$bus.$on("video-change-scene", changeScene);
      this.$once("hook:beforeDestroy", () => {
        this.$bus.$off("videoStop", handleVideoStop);
        // 周边视频相应事件
        this.$bus.$off(MapEvents.GROUP_RELATION + "." + MapEvents.WITH_VIDEO, handleClickForMapPeripheralVideo);
        this.$bus.$off(MapEvents.GROUP_RELATION + "." + MapEvents.WITHOUT_VIDEO, this.callbackAfterClosePeripheralVideo);

        // 响应切换场景
        this.$bus.$off("video-change-scene", this.changeScene);
      });
    },
    init() {
      const videoConfig = this.getGlobalConfig().videoConfig;
      if (videoConfig) {
        this.groups = Object.freeze(videoConfig.groups || []);
        this.defaultLayoutConfig.layout = Object.freeze([{
          "component": "",
          "h": 8,
          "i": 1,
          "moved": false,
          "type": "mp4",
          "w": 48,
          "x": 0,
          "y": 0
        },
        {
          "component": "",
          "h": 8,
          "i": 2,
          "moved": false,
          "type": "mp4",
          "w": 48,
          "x": 0,
          "y": 8
        },
        {
          "component": "",
          "h": 8,
          "i": 3,
          "moved": false,
          "type": "mp4",
          "w": 48,
          "x": 0,
          "y": 16
        },
        {
          "component": "",
          "h": 8,
          "i": 4,
          "moved": false,
          "type": "mp4",
          "w": 48,
          "x": 0,
          "y": 24
        },
        {
          "component": "",
          "h": 8,
          "i": 1,
          "moved": false,
          "type": "mp4",
          "w": 48,
          "x": 0,
          "y": 32
        }]);
        this.defaultLayoutConfig.playInterval = (videoConfig.playInterval || 60) * 1000;
        // this.defaultLayoutConfig.playInterval = 20000;
        this.currentLayoutConfig = this.defaultLayoutConfig;
        this.surroundRadius = videoConfig.surroundRadius || 500;
        this.getVideoData();
      }
    },
    initConfig(settings = null) {
      this.currentVideos = this.videoStatus === "normal" ? this.currentRawVideos : this.videosByArea;
      const { layout, playInterval } = this.currentLayoutConfig;
      // console.log("initConfig", this.rawVideos, this.currentMode, this.rawVideos[this.currentMode]);
      // const { layout, playInterval } = this.currentLayoutConfig = settings ? {
      //   ...settings,
      //   layout: settings.layouts || []
      // } : this.defaultLayoutConfig;

      this.currentPlayOption = {
        currentPage: 1,
        totalPage: layout.length > 0 ? Math.ceil(this.currentVideos.length / layout.length) : 0,
        pageSize: layout.length,
        interval: playInterval
      };

      this.switchVideo(0);

      this.handleClickForToggleVideoLayer(true);

      if (this.playStatus) {
        this.handleClickForToggleAutoSwitch(true);
      }
    },
    getVideoData() {
      this.loading = true;
      getVideoList().then(res => {
        // console.log("视频列表", res);
        this.loading = false;
        this.rawVideos = Object.keys(res || {}).reduce((r, key) => {
          r[key] = Object.freeze(res[key]);
          return r;
        }, {});
        this.updateSelections();
      }).catch(() => {
        this.loading = false;
      });
    },
    updateSelections() {
      const sections = this.groups.reduce((r, d) => {
        r.push({
          label: d.label,
          value: d.label
        });
        return r;
      }, [{ label: "全部视频", value: "全部视频" }]);
      this.selections = sections.map(d => {
        return {
          value: d.label,
          label: `${d.label} (${thousandCentimeter((this.rawVideos[d.label] || []).length)})`
        };
      });
      this.currentMode = this.selections[0].value;
      this.handleSelectForChangeMode();
    },
    async handleClickForOpenPeripheralVideo(data) {
      this.areaLoading = true;
      try {
        let res = await getVideosByArea(data);
        console.log("周边视频", res);

        if (this.videoStatus !== "area") {
          this.videoStatus = "area";
        }

        this.videosByArea = Object.freeze(res || []);

        this.initConfig();
      } catch (error) {
        console.log(error);
      } finally {
        this.areaLoading = false;
      }
    },
    handleClickForClosePeripheralVideo() {
      if (this.videoStatus !== "area") return false;

      if (this.relationLayInfo) {
        this.$bus.$emit(MapEvents.GROUP_OPERATE + "." + MapEvents.LAYER_CLOSE, this.relationLayInfo);
        // 重置地图
        this.$_mapProxy.fullExtent();
        this.relationLayInfo = null;
     }
    },
    callbackAfterClosePeripheralVideo() {
      this.videoStatus = "normal";
      this.videosByArea = [];
      this.initConfig();
    },
    handleSelectForChangeMode() {
      this.initConfig();
    },
    handleChangeForSelectPanel(status) {
      if (status) {
        this.toggleActionPanel(false);
      } else if (this.mouseEnterActionsPanel) {
        this.toggleActionPanel(true);
      }
    },
    handleMouseForToggleActionsPanel(status) {
      this.mouseEnterActionsPanel = status !== undefined ? status : !this.actionsPanelVisible;
      this.toggleActionPanel(status);
    },
    toggleActionPanel(status) {
      this.actionsPanelVisible = status !== undefined ? status : !this.actionsPanelVisible;
    },
    handleClickForNext() {
      if (this.currentPlayOption.totalPage < 2 || this.currentPlayOption.pageSize < 1) return false;
      this.handleClickForToggleAutoSwitch(false);
      this.switchVideo(1);
    },
    handleClickForPrev() {
      if (this.currentPlayOption.totalPage < 2 || this.currentPlayOption.pageSize < 1) return false;
      this.handleClickForToggleAutoSwitch(false);
      this.switchVideo(-1);
    },
    handleClickForToggleAutoSwitch(status) {
      if (this.currentPlayOption.totalPage < 2 || this.currentPlayOption.pageSize < 1) return false;
      this.playStatus = status !== undefined ? status : !this.playStatus;

      if (this.playStatusTimer) {
        clearInterval(this.playStatusTimer);
        this.playStatusTimer = null;
      }

      if (this.playStatus) {
        this.playStatusTimer = setInterval(() => {
          this.switchVideo(1);
        }, this.currentPlayOption.interval);
      }
    },
    switchVideo(increase) {
      // 重置点击地图视频的索引
      this.videoIndexForClickMap = -1;
      let { currentPage, totalPage, pageSize } = this.currentPlayOption;
      const newCurrentPage = this.currentPlayOption.currentPage = totalPage > 0 ? (currentPage + increase) % totalPage : currentPage;
      this.pageVideos = this.currentVideos.slice((newCurrentPage - 1) * pageSize, newCurrentPage * pageSize);
    }
  },
  created() {
    this.init();
    this.registerVideoLayer();
    this.addListenersFromAnotherModules();
  },
  mounted() {
    console.log("@@@@@@@@@@", this.$attrs);
  },
  beforeDestroy() {
    this.handleClickForToggleAutoSwitch(false);
    this.mapLayer && this.$_mapProxy.removeLayer(this.mapLayer.getId());
  }
};
