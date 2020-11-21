<template>
  <div class='treeMenu' :style="extendStyle">
    <ul class="ct_ul">
      <li :class="{active_li: activeIndex===index&&!item.hasOwnProperty('checked')}" class="ct_li" v-for="(item, index) in listData" :key="index" @click.stop='clickSelf(index, item)'>
        <span v-if='item.hasOwnProperty("checked")' class="fakeCheckbox"  :class="{activeCheckbox: item.checked}"></span>
        <span>{{item[item.nameKey]}}</span>
        <span class="ct_count"
                v-if="formatMethod">{{formatMethod&&formatMethod(item)}}</span>
        <i
            class="hasItemIcon"
            v-show="hasChecked(index)"
          ></i>
      </li>
    </ul>
    <tree-menu :is-expand="isExpand" :reverse="reverse" v-on="$listeners" :formatMethod="formatMethod" v-if='matchList.length' :list='matchList' :radio="radio"/>
  </div>
</template>
<script>
export default {
  name: "treeMenu",
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    formatMethod: {
      type: Function,
      default() {
        return null;
      }
    },
    isExpand: {
      type: Boolean,
      default: false
    },
    single: {
      type: Boolean,
      default: false
    },
    radio: {
      type: Boolean,
      default: false
    },
    attr: {
      type: String,
      default: ""
    },
    reverse: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      listData: [],
      activeIndex: undefined
    };
  },
  watch: {
    list: {
      handler(nv, ov) {
        this.listData = [...this.list];
        this.activeIndex = undefined;
        if (this.isExpand) this.activeIndex = 0;
      },
      immediate: true
    }
  },
  computed: {
    extendStyle() {
      return this.reverse ? "flex-direction: row-reverse;right: 0;" : "";
    },
    matchList () {
      let res = [];
      // console.log("进入小熊调试模式", this.list, this.activeIndex)
      if (this.activeIndex !== undefined && this.listData && this.listData.length) {
        let item = this.listData[this.activeIndex];
        if (item.childKey) {
          res = item[item.childKey];
        }
      }
      return res;
    }
  },
  methods: {
    clickSelf(index, item) {
      this.activeIndex = index;
       let parentLabels = [];
      if (item.hasOwnProperty("checked")) {
        if (this.radio) {
          (this.listData || []).forEach((d, i) => {
            if (d.checked && i !== index) {
              d.checked = false;
            }
          });
        }
        item.checked = !item.checked;

        if (this.getParentLabel) { parentLabels = this.getParentLabel(); }
        let sendData = Object.assign({}, item);
        sendData.parentLabels = parentLabels;
        this.$emit("choose-item", sendData);
      }

      if (this.single) {
        if (this.getParentLabel) { parentLabels = this.getParentLabel(); }
        let sendData = Object.assign({}, item);
        sendData.parentLabels = parentLabels;
        this.$emit("choose-item", sendData);
      }
    },
    inspectCheck(list) {
      return list.some((item) => {
        if (item.hasOwnProperty("checked")) {
          return item.checked;
        } else if (item.childKey) {
          return this.inspectCheck(item[item.childKey]);
        }
      });
    },
    hasChecked(index) {
      let item = this.listData[index];
      let includeChecked = false;
      if (item.hasOwnProperty("childKey")) {
        includeChecked = this.inspectCheck(item[item.childKey]);
      }
      return includeChecked;
    },
    getActiveItem() {
      let parentLabel = [];
      if (this.getParentLabel) {
        parentLabel = this.getParentLabel();
      }

      let activeItem = this.list[this.activeIndex];
      parentLabel.push(activeItem[activeItem.nameKey]);
      return parentLabel;
    }
  },
  provide() {
    return {
      getParentLabel: this.getActiveItem
    };
  },
  inject: {
    getParentLabel: {
      default: undefined
    }
  }

};
</script>
<style lang="scss" scoped>
.treeMenu{
  // position: absolute;
   z-index: 100;
  display: flex;
  background: rgba(15, 46, 96, 0.6);
  border-radius: 0.04rem;
  .ct_ul {
    overflow: auto;
    box-sizing: border-box;
    width: 4.2rem;
    max-height: 6rem;
    font-size: 0.28rem;
    line-height: 0.4rem;
    color: #ffffff;
    border:1px solid #4E78A4;

    &::-webkit-scrollbar {
      width: 0.1rem;
      height: 0.1rem;
    }

    /*滑块*/
    &::-webkit-scrollbar-thumb {
      background: #40abb2;
      min-height: 0.2rem;
      min-width: 0.2rem;
      border-radius: 0.1rem;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #40abb2;
    }

    /*滑道*/
    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 0.06rem #40abb2;
      border-radius: 0.1rem;
    }

    li{
      // white-space: nowrap;
      padding: 0.05rem 0.1rem;

      &:hover {
        background: rgba(24, 93, 123, 0.6);
        color: #69bef4;
      }

      span.fakeCheckbox {
        cursor: pointer;
        position: relative;
        padding-left: 0.3rem;
        &::before {
          box-sizing: border-box;
          padding: 0.01rem;
          position: absolute;
          content: "";
          width: 0.2rem;
          text-align: center;
          height: 0.2rem;
          line-height: 0.2rem;
          left: -0rem;
          top: 50%;
          transform: translateY(-50%);
          display: inline-block;
          background: #4686a9;
        }
      }
      span.activeCheckbox::before{
        content: "\2713";
        font-size: 0.2rem;
      }
      .ct_count {
        color: white !important;
        margin-left: 0.2rem;
        margin-right: 0.1rem;
      }
      i.hasItemIcon {
        display: inline-block;
        margin-left: 0.1rem;
        width: 0.2rem;
        height: 0.2rem;
        background: rgb(179, 207, 19);
        border-radius: 0.1rem;
      }
    }
    li.active_li{
      background: rgba(24, 93, 123, 0.6);
      color: #69bef4;
    }

  }
}
</style>
