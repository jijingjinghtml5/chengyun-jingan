<template>
  <div class="panel">
    <div class="category">案件信息</div>
    <div class="basic-info">
      <div class="item">
        <span>案件ID: </span>
        <span>{{ info.case_id }}</span>
      </div>
      <div class="item">
        <span>案件名称: </span>
        <span>{{ info.case_name }}</span>
      </div>
      <div class="item">
        <span>案件状态: </span>

        <span>{{ statusMap[info.status] }}</span>
      </div>
      <div class="item">
        <span>案件位置: </span>
        <span>{{ info.address }}</span>
      </div>
    </div>
    <div class="category">流转过程</div>
    <div class="basic-info">
      <div class="item">
        <span>发现时间: </span>
        <span>{{ info.report_time }}</span>
      </div>
      <div class="item">
        <span>发现人: </span>
        <span>{{ info.report_user }}</span>
      </div>
      <div class="item">
        <span>处置时间: </span>
        <span>{{ info.dispose_time }}</span>
      </div>
      <div class="item">
        <span>处置人: </span>
        <span>{{ info.dispose_department }}</span>
      </div>
      <div class="item">
        <span>结案时间: </span>
        <span>{{ info.close_time }}</span>
      </div>
      <div class="item">
        <span>结案人: </span>
        <span>{{ info.close_department }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/http/request";
import dayjs from "dayjs";
export default {
  name: "caseDetailPopup",
  inject: ["getGlobalConfig"],
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      tableData: [],
      statusMap: {
        待立案: "发现",
        处置中: "处置",
        已完结: "结案",
        作废: "暂不转换",
      },
    };
  },
  filters: {
    formatTime(value) {
      return dayjs(value * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  methods: {},
  created() {
    console.log(this.info);
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.panel {
  width: 6.4rem;
  height: 12rem;
  padding: 0.4rem 0.2rem;
  font-size: 0.32rem;
  color: rgba(146, 185, 247, 1);
  .item {
    padding: 0.2rem 0;
    & > span:last-child {
      color: #ffffff;
    }
  }
  .category {
    width: 100%;
    font-size: 0.44rem;
    margin-bottom: 0.2rem;
    font-family: MicrosoftYaHei;
    color: rgba(146, 185, 247, 1);
  }
  .code-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.15rem;
    background-image: linear-gradient(266deg, #07397a 2%, #0a2876f2 72%);
    & > p {
      font-size: 0.36rem;
      color: #ffffff;
      line-height: 1rem;
    }
    img {
      width: 100%;
    }
  }
  ::v-deep {
    .el-table {
      tr {
        background: transparent;
        color: #fff;
        font-size: 20px;
        &:hover {
          td {
            background: transparent;
          }
        }
      }
      td {
        background: transparent;
        color: #fff;
        font-size: 20px;
      }
      th {
        background: transparent;
        color: #fff;
        font-size: 20px;
      }
    }
  }
}
</style>
