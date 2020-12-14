<template>
  <div class="mapToolsContainer" >
     <div v-for="(item,index) in mapToolsData" :key="index"  style="position:relative" >
         <div class="btnLable" v-show="labelActives[index]">{{btnActives[index]?functionDatas[item.name].closeLable:functionDatas[item.name].openLable}}</div>
         <div :class="{btnClass:true, btnClassActive:btnActives[index]}" @click="btnClick(item,index)" @mouseover="btnMouseOver(index)" @mouseout="btnMouseOut(index)">
           <span v-if="functionDatas[item.name].number !== undefined" class="btn-number">{{functionDatas[item.name].number}}</span>
           <span v-if="functionDatas[item.name].number === undefined" class="iconfont  mapControlIcon"  :class="functionDatas[item.name].iconClass" ></span>
         </div>
     </div>
  </div>
</template>
<script>
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
        { "name": "全图", "status": false },
        { "name": "街道边界", "status": false },
        { "name": "网格边界", "status": false },
        { "name": "居委边界", "status": false },
        { "name": "建筑白模", "status": false },
        { "name": "建筑精模", "status": false },
        { "name": "底图切换", "status": true }
      ],
      functionDatas: {
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
           number: 346,
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
  computed: {
    // btnActives() {
    //   let data = [];
    //   this.mapToolsData.forEach(e => {
    //     data.push(false);
    //   });
    //   return data;
    // }
  },
  watch: {
     btnActives: {
       handler(val) {
          // console.log(val, "cL");
       },
       deep: true

     }
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
            "zoom": 10,
            "isRotation360": false
          }
        };
        window.bridge.Invoke(position);
    },
    onMapReady() {
      this.initPosition();
      // this.openDetailModelLayer();
      this.openRemoteScenseLayer();
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
                 "popupEnabled": false

              }
          };
      window.bridge.Invoke(cmd);
    },
    openRemoteScenseLayer() {
       let cmd = {
                "ActionName": "ChangeMapTheme",
                "Parameters": {
                  "mapthemeid": "scyxbasemap"
                }
              };
      window.bridge.Invoke(cmd);
    },
    closeRemoteScenseLayer() {
      let cmd = {
                "ActionName": "ChangeMapTheme",
                "Parameters": {
                  "mapthemeid": "basetheme"
                }
              };
      window.bridge.Invoke(cmd);
    },
    openDetailModelLayer() {
      this.tabModelLayer("建筑精模", true);
    },
    closeDetailModelLayer() {
       this.tabModelLayer("建筑精模", false);
    },
    openSimpleModelLayer() {
      this.tabModelLayer("建筑白模", true);
    },
    closeSimpleModelLayer() {
      this.tabModelLayer("建筑白模", false);
    },
    openStreetLayer() {
      this.tabMapLayer("街道乡镇组", true);
    },
    openJuweiLayer() {
      this.tabMapLayer("居委会", true);
    },
    closeJuweiLayer() {
      this.tabMapLayer("居委会", false);
    },
    closeStreetLayer() {
      this.tabMapLayer("街道乡镇组", false);
    },
    openGridLayer() {
      this.tabMapLayer("责任网格", true);
    },
    closeGridLayer() {
       this.tabMapLayer("责任网格", false);
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
}
.btnClass:hover{
  background-color: rgba(#0f2e60, 1);
  border: 1px solid #ffffff;

}
.mapToolsContainer {
  position: absolute;
  z-index:9999;
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
