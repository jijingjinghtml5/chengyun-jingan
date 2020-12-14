<template>
<wrap-title :txt="`${item.label}列表`" :level="2" icon="icon-biaoti" class="dashboard">
    <div v-if="withDashboard" slot="right" class="title-right">
    <span @click="handleClick" class="clickAble">[案件概览]</span>
  </div>
  <m-list style="height: 920px;"
   :loading="loading"
    ref="caseList"
    :headers="headers"
    :dataset="tableData"
    @rowClick="handleRowClick"
  >
    <template  v-slot:state="{row}">
      <div :style="`color: ${getStatusColor(row.status)}`">
        <span class="iconfont " :class="getIcon(row.status)"></span>
        <span>{{row.status}}</span>
      </div>
    </template>
  </m-list>
</wrap-title>
</template>
<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import MTitle from "@/components/MTitle/LevelTitle";
import MList from "@/components/MList/index.vue";
import { CaseSteps } from "@/mapping";
// import {formatterDate} from "@"

import { getListData } from "./api";

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
    },
    withDashboard: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    "item.key": {
      handler(nv) {
        this.tableData = [];
        // console.log("watch", this.item);
        let filter = "";
        let timestamp = (new Date()).getTime();
        switch (nv) {
          case "yellow":
            filter = `(openTS=-604800&args.chs_userId_36=ex.false&args.chs_userId_47=ex.false&args.chs_userId_24=ex.false&((closeTS=ex.false&allEndTS=lt.${timestamp})|(closeTS=ex.true&script="doc['data.closeTS'].value.getMillis()>doc['data.allEndTS'].value.getMillis()")))`;
            break;
          case "red":
            filter = "openTS=-604800&district_eventType.level_2=in.,重大危险源,路面塌陷,自来水管破裂,路面积水、污水冒溢、粪便冒溢,燃气管破裂,占用消防通道违章停车,人员非正常聚集,电梯困人,超期未整改,相关业务,违规装修、改建";
            break;
          default:
        }
        if (filter) {
          this.getListData(filter);
        }
      },
      deep: true,
      immediate: true
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
          prop: "eventName",
          width: "280px"
        },
        {
          label: "发生时间",
          prop: "openTS",
          type: "date",
          isSecond: true,
          dateFmt: "MM.dd hh:mm"
        },
        {
          label: "发生位置",
          prop: "address",
          align: "left"
        },
        {
          label: "所属街道",
          prop: "town"
        },
        {
          label: "处置阶段",
          prop: "status",
          filter: true,
          type: "slot",
          slot: "state"
        }
      ],
      tableData: [
      ],
      caseLayer: null
    };
  },
  methods: {
    handleClick() {
      this.$emit("click", "dashboard", this.item);
    },
    getStatusColor(status) {
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
          color = "#6CCB73";
          break;
        default:
          color = "#7BABF5";
      }
      return color;
    },
    getIcon(status) {
      switch (status) {
        case "发现":
          return "icon-faxian";
        case "立案":
          return "icon-lian";
        case "派遣":
          return "icon-paiqian";
        case "处理":
          return "icon-chuzhi";
        case "核查":
          return "icon-hecha";
        case "结案":
          return "icon-jiean";
        default:
          return "";
      }
    },
    handleRowClick(row) {
      if (row) {
        this.caseLayer = this.$_mapProxy.pointLocation(row).setPopupConfig({
          component: "case",
          dataFormat: data => {
            return {
              // caseId_: row.id,
              caseId_: "f59f10535b7134eb6367740cbbb62a04"
            };
          }
        });
      } else {
        this.caseLayer && this.caseLayer.close();
      }
    },
    getListData(filter) {
      this.loading = true;
      getListData(filter).then(res => {
        this.tableData = res.list;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    }
  },
  beforeDestroy() {
    if (this.caseLayer) {
      this.caseLayer.close();
      this.caseLayer = null;
    }
  }
};
</script>
<style lang="scss" scoped>
  .title-right{
    cursor:pointer;
  }
</style>
