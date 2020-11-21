
export default {
  name: "commonMixin",
  data() {
    return {

    };
  },
  computed: {

  },
  watch: {

  },
  methods: {
    // 切换地图主题 Home，Gis
    changeTheme(themeid) {
      let commandParams = {
        ActionName: "changeTheme",
        Parameters: JSON.stringify({
          id: themeid
        })
      };
      if (this.mapReadyBool) {
        this.bridge.Invoke(commandParams);
      }
    },
    // 定位闪烁
    position(x, y) {
        let commandParams = {
          ActionName: "goToPosition",
          Parameters: JSON.stringify({
            positon: {
              x: x,
              y: y,
              z: 0
            },
            zoom: 12,
            heading: 0,
            tilt: 0,
            hasImg: true
          })
        };
        if (this.mapReadyBool) {
          this.bridge.Invoke(commandParams);
        }
    },
    // 清除定位闪烁
    clearPosition() {
      let commandParams = {
        ActionName: "ClearPostion"
      };
      if (this.mapReadyBool) {
        this.bridge.Invoke(commandParams);
      }
    },
    // 回到全图
    fullExtent() {
      let commandParams = {
        ActionName: "FullExtent"
      };
      if (this.mapReadyBool) {
        this.bridge.Invoke(commandParams);
      }
    },
    // 添加点图层 老方法
    addPointLayer(cmd) {
      var commandParams = {
        ActionName: "doShowPointData",
        Parameters: JSON.stringify(cmd)
      };
      if (this.mapReadyBool) {
        this.bridge.Invoke(commandParams);
      }
    },
    // 移除图层
    removeLayer(layerName) {
      var commandParams = {
        ActionName: "doRemoveShowData",
        Parameters: JSON.stringify([
          layerName
        ])
      };
      if (this.mapReadyBool) {
        this.bridge.Invoke(commandParams);
      }
    },
    // 开关地图图层
    tabMapLayer(name, visible, popupEnabled, legendVisible) {
      let commandParams = {
        "name": name, // 图层名称
        "visible": visible, // 图层开关,true为开，false为关
        "legendVisible": legendVisible || true, // 是否显示图例
        "popupEnabled": popupEnabled || true// 点击是否有弹框
      };
      let command = {
        ActionName: "LayerVisible",
        Parameters: JSON.stringify(commandParams)
      };
      if (this.mapReadyBool) {
        this.bridge.Invoke(command);
      }// 执行命令
    },
    // 展示数据图层 新接口
    showData(params) {
      let command = {
        ActionName: "ShowData",
        Parameters: JSON.stringify(params)
      };
      if (this.mapReadyBool) {
        this.bridge.Invoke(command);
      }// 执行命令
    }
  },
  created() {

  }
};
