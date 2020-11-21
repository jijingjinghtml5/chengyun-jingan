<template>
  <wrap-title class="gradient-bg" icon="icon-dihezhongdianquyu">
    <m-tabs slot="level-title" v-model="tab" :tabs="tabs"></m-tabs>
    <m-row>
      <m-column  v-for="item in activeItems" :key="item.name">
        <overview-item v-bind="item" :customClass="activeCustomClass"></overview-item>
      </m-column>
    </m-row>
  </wrap-title>
</template>
<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import MTabs from "@/components/MTabs";
import MRow from "@/components/Layout/MRow";
import MColumn from "@/components/Layout/MColumn";
import OverviewItem from "@/components/OverviewItem";
export default {
  name: "OverView",
  components: {
    WrapTitle,
    MTabs,
    MRow,
    MColumn,
    OverviewItem
  },
  inheritAttrs: false,
  data() {
    return {
      tabs: Object.freeze([
        { label: "今日城运概况", value: "today" },
        { label: "全是概览", value: "district" }
      ]),
      todayItems: Object.freeze([
        { icon: "icon-gongzuoliliangku", name: "工作力量在岗率", valueUnit: "%", valueColor: "#6CCB73", prop: "gzllzgl" },
        { icon: "icon-gongzuoliliangku", name: "市政养护执行率", valueUnit: "%", valueColor: "#6CCB73", prop: "szyhzxl" },
        { icon: "icon-zaijiangongdi", name: "在建工程巡查率", valueUnit: "%", valueColor: "#6CCB73", prop: "zjgcxcl" },
        { icon: "icon-gongzuoliliangku", name: "智能感知在线率", valueUnit: "%", valueColor: "#6CCB73", prop: "zngzzxl" },
        { icon: "icon-gongzuoliliangku", name: "静态交通使用率", valueUnit: "%", valueColor: "#6CCB73", prop: "jtjtsyl" }
      ]),
      districtItems: Object.freeze([
        { icon: "icon-renkouku", name: "实有人口", nameUnit: "（万人）", showIncrease: false, prop: "syrk", extraItems: [{ label: "户籍人口占比", prop: "hjrkzb", unit: "%" }] },
        { icon: "icon-juminxiaoqu", name: "居民人口", nameUnit: "（个）", showIncrease: false, prop: "jmrk", extraItems: [{ label: "居委数", prop: "jws" }] },
        { icon: "icon-shichang", name: "商业楼园", nameUnit: "（个）", showIncrease: false, prop: "syly", extraItems: [{ label: "企业数", prop: "qys" }] },
        { icon: "icon-xuexiao", name: "教育资源", nameUnit: "（个）", showIncrease: false, prop: "jyzy", extraItems: [{ label: "学生教师比", prop: "xsjsb" }] },
        { icon: "icon-yiyuan", name: "医疗资源", nameUnit: "（个）", showIncrease: false, prop: "ylzy", extraItems: [{ label: "三甲医院", prop: "sjyy" }] },
        { icon: "icon-wulianganzhi", name: "物联感知", nameUnit: "（台）", showIncrease: false, prop: "wlgz", extraItems: [{ label: "覆盖率", prop: "cover", unit: "%" }] }
      ]),
      tab: "today"
    };
  },
  computed: {
    activeItems() {
      return this[`${this.tab}Items`] || [];
    },
    activeCustomClass() {
      return this.tab === "district" ? "style2" : "style1";
    },
    activeDataset() {
      return {};
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap-title {
  /deep/ {
    .wrap-title__content {
      justify-content: center;
    }
  }
}
</style>
