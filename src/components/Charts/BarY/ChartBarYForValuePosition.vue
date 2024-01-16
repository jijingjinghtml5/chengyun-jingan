<template>
  <div class="v-chart-container">
    <div class="v-chart-wrap">
      <ul v-if="valuePosition === 'left'" class="v-chart-column__label" :style="sideStyle">
        <li v-for="(item, index) in source" :key="index">
          {{ categoryLabelFmt ? categoryLabelFmt(item[0], index) : item[0] }}
        </li>
      </ul>
      <v-chart
        class="v-chart-column__chart"
        v-show="!noData"
        :options="options"
        autoresize
        auto-resize
        @click="chartEvents"
      />
      <ul v-if="valuePosition === 'right'" class="v-chart-column__value" :style="sideStyle">
        <li v-for="(item, index) in source" :key="index">
          {{ item[1] | thousandCentimeter }}{{ unit }}
        </li>
      </ul>
    </div>
    <p
      class="no-data-tip"
      :style="{ fontSize: fontSize_ ? fontSize_ + 'px' : '' }"
      v-show="noData"
    >暂无数据</p>
  </div>
</template>
<script>
// 右侧显示值
import { thousandCentimeter } from "../../../utils/tools";
import ChartBaseMixins from "../mixins/ChartBaseMixins";
import ChartMixins from "../mixins/ChartCustomMixins";
import requestJa from '@/http/requestJa'
import SHcoordinateUtils from '@/lib/MapProxy/coordUtils/SHcoordinateUtils'
export default {
  name: "ChartBarForValuePosition",
  mixins: [ChartBaseMixins, ChartMixins],
  props: {
    gradientDir: {
      type: String,
      default: "x"
    },
    isStack: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: null
    },
    valuePosition: {
      type: String,
      default: "right"
    },
    sourceType: {
      type: String,
      default: ''
    }
  },
  methods: {
    chartEvents(e) {
      e = e || {}
      if (this.sourceType && (this.sourceType === 'grid' || this.sourceType === 'hotline')) {
        let street = e.name || e.value
        requestJa({
          url: '/dmp2/united-ciimc-api/v1/generic-query',
          params: {
            index_type: 'active',
            token: 'dp3e13b16efff2aeaec9bda8cc70e3dp',
            table: this.sourceType === 'grid' ? 'area-event' : 'hotline-area-event',
            limit: 10000,
            source: 'data.location,data.uuid,args.chs_code',
            transform: 'messages[].{uuid:data.uuid,code:args.chs_code,location:data.location}',
            district: '静安区',
            town: this.sourceType === 'grid' ? `${street}街道` : street,
            filter: 'openTS=today'
          }
        }).then(res => {
          let list = (res && res.data || []).map(item => {
            let coord = SHcoordinateUtils.WGStoSH([Number(item.location.longitude), Number(item.location.latitude)])
            return {
              sourceType: this.sourceType,
              code: item.code,
              uuid: item.uuid,
              lng: coord[0],
              lat: coord[1] 
            }
          })
          this.$bus.$emit('show-street-case-point', list || [])
        })
      }
    }
  },
  computed: {
    source() {
      return this.chartData && this.chartData.length > 1 ? this.chartData.slice(1) : [];
    },
    sideStyle() {
      return { color: this.labelColor, marginTop: this.showLegend ? +this.fontSize_ * 1.5 + "px" : 0 };
    },
    options () {
      const dataArr = this.chartData && this.chartData.length > 1 ? this.chartData[0].slice(1) : [];

      const series = dataArr.map((d, i) => {
        return {
          type: "bar",
          barMaxWidth: +this.barMaxWidth_,
          stack: this.isStack ? "stack" : null,
          showBackground: !!this.backgroundColor,
          backgroundStyle: {
            color: this.backgroundColor
          },
          itemStyle: {
            color: this.getColor(i)
          },
          z: 1
        };
      });
      return {
        ...this.baseOptions,
        grid: {
          top: this.showLegend ? +this.fontSize_ * 1.5 : 0,
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          ...this.yAxis,
          max: "dataMax",
          triggerEvent: true
        },
        yAxis: {
          type: "category",
          splitLine: { show: false },
          axisLabel: {
            show: true,
            fontSize: +this.fontSize_,
            color: this.labelColor,
            interval: 0,
            formatter: this.valuePosition === "right" ? this.categoryLabelFmt : (value, index) => thousandCentimeter(this.source[index][1]) + this.unit
          },
          // inverse: true,
          axisTick: { show: false },
          inverse: true,
          axisLine: {
            show: false
          },
          triggerEvent: true
        },
        series: series
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.v-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  .echarts {
    width: 100%;
    height: 100%;
  }
  .no-data-tip {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    line-height: 1;
    color: #fff;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
.v-chart-wrap {
  display: flex;
  width: 100%;
  height: 100%;
}
.v-chart-column__chart {
  width: 0;
  flex: 1;
}
.v-chart-column__label,
.v-chart-column__value {
  text-align: right;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  > li {
    height: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
.v-chart-column__label {
  margin-right: 0.1rem;
}
.v-chart-column__value {
  margin-left: 0.1rem;
}
</style>
