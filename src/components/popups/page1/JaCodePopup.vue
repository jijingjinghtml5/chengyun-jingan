<template>
  <div class="panel">
    <div class="category">码信息</div>
    <div class="basic-info">
      <div class="item">
        <span>码类型: </span>
        <span>{{ info.type }}</span>
      </div>
      <div class="item">
        <span>所属街道: </span>
        <span>{{ info.street }}</span>
      </div>
      <div class="item">
        <span>绑定位置: </span>
        <span>{{ info.address }}</span>
      </div>
      <div class="item">
        <span>码编号: </span>
        <span>{{ info.code }}</span>
      </div>
    </div>
    <div class="code-wrap">
      <p>相关案件信息</p>
      <el-table
        :data="tableData"
        style="width: 100%;background: transparent;"
        @row-click="clickTr"
      >
        <el-table-column prop="case_name" label="案件名称" width="180">
        </el-table-column>
        <el-table-column prop="report_time" label="上报时间" width="180">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ statusMap[scope.row.status] }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import request from "@/http/request";
import dayjs from "dayjs";
export default {
  name: "JaCodePopup",
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
  methods: {
    clickTr(row) {
      // this.$emit('addNewPopup', 'caseDetailPopup')
      this.$bus.$emit("addNew", {
        key: "caseDetailPopup",
        componentName: "caseDetailPopup",
        showClose: true,
        mapData: row,
        stylePopup: {
          'padding-left': '0',
          left: '700px'
        }
      });
    },
    getList() {
      request({
        url:
          "http://10.210.232.237/internal-api/gateway/screen-api/generic-query",
        params: {
          table: "jingan_code_case",
          response_type: "list",
          query_name: "code,status",
          query_value: "CJD000289" + ",作废",
          query_operation: "eq,neq",
          query_match_type: "and",
          order_by: "report_time desc",
          limit: 10,
        },
      }).then((res) => {
        this.tableData = res || [];
      });
    },
  },
  created() {
    console.log(this.info);
  },
  mounted() {
    this.getList();
  },
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
