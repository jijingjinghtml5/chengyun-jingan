<template>
  <auto-scroll-wrap
      v-show="dataset && dataset.length"
      :isVirtual="true"
      :dataset="dataset"
      :stop="activeIndex !== -1"
      :distance="createFnForCalcRealPx(5)">
      <RecycleScroller
        ref="wrap"
        :items="dataset"
        :itemSize="rowHeight"
        :keyField="'id'"
        v-slot="{ item, index }">
        <div class="li-item"  @click="handleClickForCaseList(item, index)">
          <div class="cell title">
            <p class="level1 text-ellipsis">{{ item.town }}</p>
            <p class="level2 text-ellipsis">综合考评:{{ item.score }}</p>
          </div>

          <div class="cell opt"></div>
        </div>
      </RecycleScroller>
  </auto-scroll-wrap>
</template>
<script>
import AutoScrollWrap from "@/components/AutoScrollWrap";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

export default {
  name: "TownSummary",
  inject: ["createFnForCalcRealPx"],
  components: { AutoScrollWrap, RecycleScroller },
  data() {
    return {
      activeIndex: -1,
      total: 1000,
      dataset: [
        {
          id: 1,
          town: "南京西路街道",
          score: "100"
        }
      ],
      rowHeight: 130
    };
  },
  methods: {
    handleClickForCaseList(item) {

    }
  }
};
</script>
<style lang="scss" scoped>

  .title-right{
    color: #ffffff;
  }

  .li-item{
    border-top: 2px solid #4E78A4;
    border-bottom: 2px solid #4E78A4;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 118px;
    line-height: 1.5;
    .cell{
      padding: 0 10px;
    }
    .level1{
      font-size: 36px;
      font-weight: bold;
      color: #ffffff;
    }
    .level2{
      font-size: 28px;
      color: #92B9F7;
    }
  }

</style>
