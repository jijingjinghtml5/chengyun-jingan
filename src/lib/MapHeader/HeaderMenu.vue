<template>
  <div class="menu-container">
    <div class="mapControlItem" v-for="(item ,index) in mapControlItem" :key="index">
        <div @click="mapLayerControlClick(item)">
          <div class="iconfontContainer" :class="item.attr === itemClickAttr ? 'active' : ''">
            <span class="iconfont mapControlIcon" :class="item.iconClass"></span>
          </div>
          <div class="mapControlLable" :class="item.attr === itemClickAttr ? 'activeRotate' : ''">
            <p class="mapControlLableText">
              {{item.name}}
              <span v-if="item.columns>0" class="iconfont icon-arrow_right mapControlLableIcon"></span>
            </p>
            <p class="mapControlLableNumber">{{item.module ? item.module.mapControlItemData[item.attr] : mapControlItemData[item.attr] | thousandCentimeter}}</p>
          </div>
        </div>
         <!-- 下面组件为tree-list的重构组件，自动根据数据展示动态列数，不需要手动设置列数 -->
        <treeMenu
         :formatMethod="formatMethod[item.attr]"
          :is-expand="item.isExpand"
          @choose-item="chooseItem"
          style="position:absolute"
          v-show="showMenu(item)"
          :list="item.module? item.module.checkItems[item.attr] : checkItems[item.attr]"
          :radio="item.radio"
          :attr="item.attr"
          :reverse="item.reverse||false"
        />
      </div>
  </div>
</template>
<script>
import treeMenu from "./treeMenu";
export default {
  name: "headerMenu",
  inject: ["getGlobalConfig"],
  components: { treeMenu },
  props: {
    mapControlItem: {
      type: Array,
      default: () => {
        return [
          // {
          //   name: "居委会(个)",
          //   iconClass: "icon-juminxiaoqu",
          //   attr: "juwei",
          //   columns: 2,
          //   radio: true,
          //   module: CommunityHeaderMenu
          // }
        ];
      }
    },
    mapControlItemData: {
      type: Object,
      default: () => {
        return {
          // juwei: "-",
        };
      }
    },
    checkItems: {
      type: Object,
      default: () => {
        return {
          // juwei: []
        };
      }
    },
    formatMethod: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      itemClickAttr: ""
    };
  },
  created() {
    this._loadModules();
  },
  methods: {
    showMenu(item) {
      return item.attr === this.itemClickAttr &&
      (item.module ? item.module.checkItems[item.attr].length > 0 : this.checkItems[item.attr] && this.checkItems[item.attr].length > 0);
    },
    _loadModules() {
      this.mapControlItem.forEach(item => {
        if (item.module) {
          item.module.init(this);
        }
      });
    },
    mapLayerControlClick(item) {
      // 地图bar条模块展开事件
      let status = 0; // close
      if (this.itemClickAttr === item.attr) {
        this.itemClickAttr = "";
      } else {
        this.itemClickAttr = item.attr;
        status = 1; // open
      }
      this.$bus.$emit("map-header-menu-choose", {
        status: status,
        item: item
      });
    },
    chooseItem(item) {
      // 地图bar条菜单 选中事件
      this.$bus.$emit("map-header-item-choose", {
        status: 1,
        item: item,
        itemClickAttr: this.itemClickAttr
      });
      // console.log(item, "itemSource----------------------");
    }
  },
  beforeDestroy() {
    // this.mapControlItem.forEach(item => {
    //   if (item.module && item.module.destroy) {
    //     item.module.destroy();
    //   }
    // });
  }

};
</script>

<style lang="scss" scoped>
.menu-container{
  width: 100%;
  height: 100%;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;

  .mapControlItem {
    position: relative;
    cursor: pointer;
    display: inline-block;
    height: 1.1rem;
    margin-left: 0.2rem;

    &:last-child{
      margin-right: 0.2rem;
    }
    & > div:first-child {
      height: 100%;
    }

    .iconfontContainer {
      width: 0.9rem;
      height: 0.9rem;
      display: inline-block;
      line-height: 0.9rem;
      vertical-align: middle;
      background: url("./imgs/frame.png") no-repeat center center;
      background-size: cover;
      &.active {
        background-color: rgba(37, 115, 239, 0.4);
        >span{
          color: white;
        }
      }
      .mapControlIcon {
        display: block;
        width: 0.9rem;
        height: 0.9rem;
        text-align: center;
        color: #ffffff;
        font-size: 0.5rem;
        line-height: 0.9rem;
        color: rgba(102, 157, 244, 1);
      }
    }

    .mapControlLable {
      display: inline-block;
      vertical-align: middle;
      margin-left: 0.2rem;

      &.activeRotate > p > span {
        transform: rotate(-90deg);
      }
      .mapControlLableText {
        font-size: 0.28rem;
        color: rgba(102, 157, 244, 1);
      }
      .mapControlLableIcon {
        display: inline-block;
        font-size: 0.28rem;
        transform: rotate(90deg);
      }
      .mapControlLableNumber {
        font-size: 0.45rem;
        color: #ffffff;
        text-align: right;
        // margin-top: 0.05rem;
      }
    }
  }
}
</style>
