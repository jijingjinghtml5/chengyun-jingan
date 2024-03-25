<template>
  <div class="panel">
    <div class="category">地铁站点</div>
    <div class="basic-info">
      <div class="item">
        <span>站点名称: </span>
        <span>{{ info.data.housingEstate.areaName }}</span>
      </div>
      <div class="item">
        <span>地铁线路: </span>
        <span>{{ info.data.alias_name }}</span>
      </div>
      <div class="item" style="margin-top:0.3rem;font-size:0.36rem">
        <span style="color: rgba(146, 185, 247, 1);">进出站统计:</span>
      </div>
      <div class="item">
        <div style="display: flex;">
          <div class="tongji-div">
            <div style="background:#1E90FF;height:0.5rem;line-height:0.5rem">今日累计进站</div>
            <div style="background: #20B2AA;height:0.7rem;line-height:0.7rem;">{{ tongji.in_total | thousandCentimeter }}</div>
          </div>
          <div class="tongji-div" style="margin-left: 0.3rem;">
            <div style="background:#3CB371;height:0.5rem;line-height:0.5rem">今日累计出站</div>
            <div style="background: #20B2AA;height:0.7rem;line-height:0.7rem;">{{ tongji.out_total | thousandCentimeter }}</div>
          </div>
        </div>
      </div>
      <div class="item" style="margin-top:0.3rem;font-size:0.36rem">
        <span style="color: rgba(146, 185, 247, 1);">今日客流实时统计（单位：人次） </span>
      </div>
      <div class="item" style="height: 6rem;">
        <chart-line class="in-flex2" :chartData="chartData" :colors="colors" :showYLabel="true" :isGradient="true" :gradientBySelf="true" :showLegend="true" :legendConfig="legendConfig"></chart-line>
      </div>
    </div>
  </div>
</template>
<script>
import ChartLine from '@/components/Charts/Line/ChartLine'
import request from '@/http/request'
export default {
  name: 'shopPopup',
  inject: ['getGlobalConfig', 'createFnForCalcRealPx'],
  components: {
    ChartLine
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      chartData: [],
      tongji: {},
      colors: Object.freeze(['#1ABC9C', '#F96F4F']),
      legendConfig: Object.freeze({
        top: 0,
        left: 'center',
        icon: 'line',
        textStyle: {
          color: '#D1C9C4',
          fontSize: this.createFnForCalcRealPx(0.24)
        }
      })
    }
  },
  watch: {
    info: {
      handler(nv) {
        this.getData();
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    getData() {
      request({
        url: 'http://10.210.232.237/internal-api/gateway/station-passenger-flow/passenger-flow-stat-trend',
        params: {
          station_name: this.info.data.housingEstate.areaName.substring(0, this.info.data.housingEstate.areaName.indexOf('地铁站'))
        }
      }).then(res => {
        this.tongji = res || {}
        let list = [['实时统计', '进站', '出站']]
        res.trend && res.trend.forEach(item => {
          list.push([item.update_time, item.in_count, item.out_count])
        })
        this.chartData = list
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.in-flex2 {
  height: 5rem;
  width: 100%;
}
.tongji-div{
  display: flex;
    flex-direction: column;
    width: 2rem;
    color:#fff;
    align-items: center;
    div {
      width: 100%;
      text-align: center;
    }
}
.panel {
  width: 6.4rem;
  height: 12rem;
  padding: 0.4rem;

  font-size: 16*2px;
  color: rgba(146, 185, 247, 1);

  .item {
    padding: 10px 0;

    &>span:last-child {
      color: #FFFFFF;
    }
  }

  .split-line {
    width: 100%;
    height: 2px;
    border-bottom: 2px solid rgba(78, 120, 164, 1);
    margin: 20px 0;
  }

  .category {
    width: 100%;
    font-size: 22*2px;
    font-family: MicrosoftYaHei;
    color: rgba(146, 185, 247, 1);
  }

  .name {
    font-size: 26*2px;
    font-family: MicrosoftYaHei;
    color: #ffffff;
    padding: 20px 0;
  }
}
</style>
