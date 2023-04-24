<script>
export default {
  name: 'CustomTable',
  data() {
    return {
      activeIndex: -1
    }
  },
  props: {
    tableType: {
      type: String,
      default: ''
    },
    tableData: {
      type: Array,
      default () {
        return [];
      }
    },
  },
  methods: {
    caseClick(row, index) {
      if (this.activeIndex !== index) {
        this.activeIndex = index;
      } else {
        this.cancelClick();
      }
    },
    cancelClick() {
      if (this.activeIndex !== -1) {
        this.activeIndex = -1;
      }
    }
  },
}
</script>

<template>
  <div class="table-wrapper">
    <div class="grid-list-header">
      <template v-if="tableType === '活动信息'">
        <div class="cell">商场</div>
        <div class="cell">活动信息</div>
        <div class="cell">活动时间</div>
      </template>
      <template v-else-if="tableType === '投诉信息'">
        <div class="cell">事件名称</div>
        <div class="cell">发生时间</div>
        <div class="cell">位置</div>
        <div class="cell">阶段</div>
      </template>
      <template v-else-if="tableType === '周边路况'">
        <div class="cell">序号</div>
        <div class="cell">道路</div>
        <div class="cell">指数</div>
        <div class="cell">状态</div>
      </template>
    </div>
    <div class="grid-list-body">
      <div class="no-data" v-if="!tableData || !tableData.length">暂无数据</div>
      <div class="grid-list-row-wrap" ref="listRow" v-else>
        <div
          class="grid-list-row"
          v-for="(row, index) in tableData || []"
          :key="`disposalRow-${index}`"
          :class="{active: index === activeIndex}"
          @click="caseClick(row,index)"
        >
          <template v-if="tableType === '活动信息'">
            <div class="cell">{{ row.mall_name || '-' }}</div>
            <div class="cell">{{ row.activities_name || '-' }}</div>
            <div class="cell">{{ row.activity_time || '-' }}</div>
          </template>
          <template v-else-if="tableType === '投诉信息'">
            <div class="cell" :title="row.district_eventType.level_3">{{ row.district_eventType.level_3 || '-' }}</div>
            <div class="cell">{{ row.openTS || '-' }}</div>
            <div class="cell" :title="row.address">{{ row.address || '-' }}</div>
            <div class="cell">{{ row.exevt_status || '-' }}</div>
          </template>
          <template v-else-if="tableType === '周边路况'">
            <div class="cell">{{ (index + 1) || '-' }}</div>
            <div class="cell">{{ row.name || '-' }}</div>
            <div class="cell">{{ row.currentIndex || '-' }}</div>
            <div class="cell">{{ row.remark || '-' }}</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "@/assets/css/mixins.scss";

  .table-wrapper {
    position: relative;
    width: 100%;
    height: 5rem;
    box-sizing: border-box;
    font-size: 0.26rem;
    color: #fff;
    
    .grid-list-header {
      display: flex;
      height: 0.64rem;
      line-height: 0.64rem;
      color: #FFFFFF;
      font-size: 0.26rem;
      background-color: rgba(36, 168, 245, 0.12);
    }
    
    .grid-list-body {
      width: 100%;
      height: calc(100% - 80px);
      overflow-y: scroll;
      box-sizing: border-box;
      @include scroll-table;
      
      .no-data {
        text-align: center;
        height: 0.64rem;
        line-height: 0.64rem;
      }
    
      .grid-list-row-wrap {
        width: 100%;
        transition: 0.5s linear;
    
        .grid-list-row {
          display: flex;
          height: 0.64rem;
          line-height: 0.64rem;
          box-sizing: border-box;
          cursor: pointer;
    
          &.active {
            background: rgba(#4FCFD5, 0.4);
          }
        }
      }
    }
    
    .cell {
      @include text-overflow;
      flex: 1;
      text-align: center;
    }
  }
</style>
