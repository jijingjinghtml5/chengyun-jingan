<template>
  <div  class="panel">
    <div class="category">共享停车场</div>
    <m-list
      :headers="headers"
      :dataset="tableData"
      @rowClick="handleRowClick"
    >
    </m-list>
  </div>
</template>
<script>
import MList from "@/components/MList/index.vue";
import { getParkLots } from "../api.js";
export default {
  name: "ParkLotPopup",
  components: {
    MList
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      headers: [
        {
          label: "名称",
          prop: "name"
        },
        {
          label: "地址",
          prop: "address"
        },
        {
          label: "总车位数",
          prop: "totalBerth"
        },
        {
          label: "剩余车位数",
          prop: "freeBerth"
        }
      ],
      tableData: []
    };
  },
  created() {
    getParkLots().then(res => {
      this.tableData = (res || []).map((item, index) => {
        return {
          ...item,
          id: index
        };
      });
    });
  },
  methods: {
    handleRowClick(row) {
      if (row) {
        this.$_mapProxy.goToPosition(row.x, row.y);
      } else {
        this.$_mapProxy.clearPosition();
        this.$_mapProxy.fullExtent();
      }
    }
  },
  beforeDestroy() {
    this.$_mapProxy.clearPosition();
    this.$_mapProxy.fullExtent();
  }
};
</script>
<style lang="scss" scoped>
.panel{
  width: 10rem;
  height: 15.6rem;
  padding: 0.4rem;
  border: 1px solid #4E78A4;

  font-size: 16*2px;
  color:rgba(146, 185, 247, 1);
  .category{
    width: 100%;
    font-size:22*2px;
    font-family:MicrosoftYaHei;
    color:rgba(146,185,247,1);
  }
}
</style>
