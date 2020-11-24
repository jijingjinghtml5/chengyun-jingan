<template>
<wrap-title :txt="`${item.label}列表`" :level="2" icon="icon-biaoti" class="dashboard">
    <div slot="right" class="title-right">
    <span @click="handleClick" class="clickAble">[案件概览]</span>
  </div>
  <m-list style="height: 920px;"
    :headers="headers"
    :dataset="tableData"
  ></m-list>
</wrap-title>
</template>
<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import MTitle from "@/components/MTitle/LevelTitle";
import MList from "@/components/MList/index.vue";
import { CaseSteps } from "@/mapping";
// import {formatterDate} from "@"

export default {
  name: "TodayFocusList",
  components: {
    WrapTitle,
    MTitle,
    MList
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      filters: {
        name: {
          filters: [
            {
              label: "全部案件",
              rules: []
            }
          ]
        },
        status: {
          filters: CaseSteps.map(d => {
            return {
              label: d,
              rules: [d]
            };
          })
        }
      },
      headers: [
        {
          label: "案件",
          prop: "name"
        },
        {
          label: "发生时间",
          prop: "timestamp",
          type: "date",
          isSecond: true,
          dateFmt: "MM.dd hh:mm"
        },
        {
          label: "发生位置",
          prop: "address"
        },
        {
          label: "所属街道",
          prop: "town"
        },
        {
          label: "处置阶段",
          prop: "state",
          filter: true
        }
      ],
      tableData: [
        {
          id: 1,
          name: "2020新冠案件",
          timestamp: "1606112715",
          address: "曲阳路",
          town: "南京西路街道",
          state: "发现"
        },
        {
          id: 2,
          name: "2020新冠案件",
          timestamp: "1606112715",
          address: "曲阳路",
          town: "南京西路街道",
          state: "发现"
        },
        {
          id: 3,
          name: "2020新冠案件",
          timestamp: "1606112715",
          address: "曲阳路",
          town: "南京西路街道",
          state: "发现"
        },
        {
          id: 4,
          name: "2020新冠案件",
          timestamp: "1606112715",
          address: "曲阳路",
          town: "南京西路街道",
          state: "发现"
        },
        {
          id: 5,
          name: "2020新冠案件",
          timestamp: "1606112715",
          address: "曲阳路",
          town: "南京西路街道",
          state: "发现"
        }
      ]
    };
  },
  methods: {
    handleClick() {
      this.$emit("click", "dashboard", this.item);
    },
    getStatus(status) {
      let color = "";
      switch (status) {
        case "发现":
        case "立案":
          color = "#26ffff";
          break;
        case "派遣":
        case "处理":
        case "核查":
          color = "#f1c40f";

          break;
        case "结案":
          color = "#14ddb3";
          break;
        default:
          color = "#7BABF5";
      }
      return { color };
    }
  }
};
</script>
<style lang="scss" scoped>
  .title-right{
    cursor:pointer;
  }
</style>
