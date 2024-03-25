<template>
  <wrap-title class="gradient-bg" icon="icon-jingji" txt="经济治理">
    <p class="shopText" @click="openNewTab">”五.五购物节”</p>
    <level-title :level="2" icon="icon-biaoti" txt="重点产业和房地产税收收入"></level-title>
    <overview-item style="margin-top: -0.2rem;" valueUnit="亿元" :value="zhongdianTotalValue"
      :increase="zhongdianTotalRatio" customClass="style7"></overview-item>
    <chart-pie class="in-flex" :chartData="zhongdianchangyePie" :colors="colors" :fontSize="0.24" unit="亿元"
      labelColor="#D1C9C4">
      <template v-slot:li="{ item }">
        <span class="legend-label text-ellipsis">{{ item[0] }}</span>
        <span class="legend-percent">{{ item[3] }}%</span>
      </template>
    </chart-pie>
    <level-title :level="2" icon="icon-biaoti">
      <m-tabs class="levelt2-select" ref="jingji" v-model="tab" :tabs="tabs"></m-tabs>
    </level-title>
    <overview-item @mouseenter.native="handleMouse('jingji', 'enter')"
      @mouseleave.native="handleMouse('jingji', 'leave')" style="margin-top: -0.2rem;" valueBefore="税收收入" valueUnit="亿元"
      :showIncrease="false" :value="getShuiShou(tab)['numerical_value']" :increase="getShuiShou(tab)['growth_ratio']"
      customClass="style7">
    </overview-item>
    <m-tabs-body class="in-flex" :tab="tab">
      <m-tabs-body-item name="yzsd" lazy>
        <chart-pie :chartData="yizhousandaiPie" :colors="colors" :fontSize="0.24" unit="亿元" labelColor="#D1C9C4">
          <template v-slot:li="{ item }">
            <span class="legend-label" :class="{ clickAble: item[0] === '南京西路' }"
              style="word-break:break-all;white-space:normal;" @click="handleClickYZSD(item)">{{ item[0] }}</span>
            <span class="legend-percent">{{ item[3] }}%</span>
          </template>
        </chart-pie>
      </m-tabs-body-item>
      <m-tabs-body-item name="lyjj" lazy>
        <chart-bary :chartData="lyjjChartData" labelColor="#fff" :colors="colors2" :isGradient="true"></chart-bary>
      </m-tabs-body-item>
      <m-tabs-body-item name="zbjj" lazy>
        <chart-pie :chartData="gyzczPie" :colors="colors" :fontSize="0.24" unit="亿元" labelColor="#D1C9C4">
          <template v-slot:li="{ item }">
            <span class="legend-label text-ellipsis">{{ item[0] }}</span>
            <span class="legend-percent">{{ item[3] }}%</span>
          </template>
        </chart-pie>
      </m-tabs-body-item>
      <m-tabs-body-item name="yqjj" lazy>
        <chart-bary :chartData="sidagongnengquPie" labelColor="#fff" :colors="colors2" :isGradient="true"></chart-bary>
      </m-tabs-body-item>
    </m-tabs-body>
    <level-title :level="2" icon="icon-biaoti">
      <m-tabs class="levelt2-select" ref="shehui" v-model="tab2" :tabs="tabs2"></m-tabs>
    </level-title>
    <m-tabs-body class="autoHeight" :tab="tab2">
      <m-tabs-body-item name="社会消费" lazy @mouseenter.native="handleMouse('shehui', 'enter')"
        @mouseleave.native="handleMouse('shehui', 'leave')">
        <m-row>
          <m-column v-for="(item, index) in shehuixiaofeiList" :key="index">
            <overview-item :name="item.field_name" :value="item.numerical_value"
              :increase="item.growth_ratio" customClass="style7">
            </overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="外商投资" lazy @mouseenter.native="handleMouse('shehui', 'enter')"
        @mouseleave.native="handleMouse('shehui', 'leave')">
        <m-row>
          <m-column v-for="(item, index) in waishangtouziList" :key="index">
            <overview-item :name="item.field_name" :value="item.numerical_value"
              :increase="item.growth_ratio" customClass="style7">
            </overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="招商引资" lazy @mouseenter.native="handleMouse('shehui', 'enter')"
        @mouseleave.native="handleMouse('shehui', 'leave')">
        <m-row>
          <m-column v-for="(item, index) in zhaoshangyinziList" :key="index">
            <overview-item :name="item.field_name" :value="item.numerical_value"
            :increase="item.growth_ratio" customClass="style7">
            </overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="科技创新" lazy @mouseenter.native="handleMouse('shehui', 'enter')"
        @mouseleave.native="handleMouse('shehui', 'leave')">
        <m-row>
          <m-column v-for="(item, index) in kejichuangxinList" :key="index">
            <overview-item :name="item.field_name" :value="item.numerical_value"
            :increase="item.growth_ratio" customClass="style7">
            </overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
    </m-tabs-body>
    <MDialog :dialogVisible.sync="dialogShow" appendDom=".layout" :extraCss="extraCss">
      <video v-if="dialogShow" :src="prefix + '/videos/nx.mp4'" style="width:100%;height: 100%;object-fit:cover;"
        autoplay loop></video>
    </MDialog>
  </wrap-title>
</template>
<script>
import MDialog from "@/components/MDialog/index";
import WrapTitle from "@/components/MTitle/WrapTitle";
import LevelTitle from "@/components/MTitle/LevelTitle";
import MSelect from "@/components/MSelect";
import OverviewItem from "@/components/OverviewItem";
import MTabs from "@/components/MTabs";
import MTabsBody from "@/components/MTabsBody/MTabsBody";
import MTabsBodyItem from "@/components/MTabsBody/MTabsBodyItem";
import Increase from "@/components/Increase";
import MRow from "@/components/Layout/MRow";
import MColumn from "@/components/Layout/MColumn";
import ChartPie from "./components/ChartPie";
import ChartBary from "@/components/Charts/BarY/ChartBarYForValuePosition";
import { getData } from "./api";
import requestApi from "@/http/requestApi.js"
export default {
  name: "EconomicGovernance",
  components: {
    MDialog,
    WrapTitle,
    LevelTitle,
    MSelect,
    OverviewItem,
    MTabs,
    MTabsBody,
    MTabsBodyItem,
    Increase,
    MRow,
    MColumn,
    ChartPie,
    ChartBary
  },
  inject: ["createFnForCalcRealPx"],
  data() {
    const arr = window.location.href.split("/");
    arr.pop();
    const prefix = arr.join("/");
    return {
      resData: [],
      zhongdianchangyeValue: '',
      zhongdianTotalRatio: '',
      zhongdianTotalValue: '',
      zhongdianchangyePie: [["五大产业和房地产业", "五大产业和房地产业"]],
      yizhousandaiPie: [["一轴三带", "一轴三带"]],
      lyjjChartData: [["楼宇经济", "楼宇经济"]],
      gyzczPie: [["总部经济", "总部经济"]],
      sidagongnengquPie: [["园区经济", "园区经济"]],
      shehuixiaofeiList: [],
      waishangtouziList: [],
      zhaoshangyinziList: [],
      kejichuangxinList: [],
      extraCss: {
        // top: "1.5rem"
        width: "100%"
      },
      prefix: prefix,
      urls: [
        {
          url: prefix + "/videos/nx.mp4"
        }
      ],
      dialogShow: false,
      colors: Object.freeze(["#30BC9B", "#2E9BCF", "#4FCFD5", "#4E78A4", "#1D7774", "#D1C9C4"]),
      colors2: Object.freeze(["#4FCFD5", "#2E9BCF"]),
      options: Object.freeze([
        { label: "本周", value: "currentWeek" },
        { label: "本月", value: "currentMonth" }
      ]),
      tabs: Object.freeze([
        { label: "一轴三带", value: "yzsd" },
        { label: "楼宇经济", value: "lyjj" },
        { label: "工业总产值", value: "zbjj" },
        { label: "四大功能区", value: "yqjj" }
      ]),
      tabs2: Object.freeze([
        { label: "社会消费", value: "社会消费" },
        { label: "外商投资", value: "外商投资" },
        { label: "招商引资", value: "招商引资" },
        { label: "科技创新", value: "科技创新" }
      ]),
      option: "currentWeek",
      tab: "yzsd",
      tab2: "社会消费"
    };
  },
  methods: {
    getShuiShou(type) {
      let tab = '一轴三带'
      if (type === 'lyjj') {
        tab = '楼宇经济'
      }
      if (type === 'zbjj') {
        tab = '工业总产值'
      }
      if (type === 'yqjj') {
        tab = '四大功能区'
      }
      let list = this.resData.filter(item => {
        return item.module_name === tab && item.field_name === '税收收入'
      })
      return (list && list[0]) || {}
    },
    openNewTab() {
      this.$bus.$emit('showShopFestival')
    },
    handleMouse(ref, mouse) {
      if (mouse === "enter") {
        this.$refs[ref].stopTimer();
      } else {
        this.$refs[ref].startTimer();
      }
    },
    getData() {
      requestApi({
        params: {
          table: 'economic_digitization_new'
        }
      }).then(res => {
        this.resData = (res && res.data) || []
        let zdlist = []
        this.resData.forEach(item => {
          if (item.module_name === '重点产业和房地产税收收入' && item.field_name === '总收入') {
            this.zhongdianTotalValue = item.numerical_value
            this.zhongdianTotalRatio = item.growth_ratio
          }
        })
        let list1 = this.resData.filter(item => {return item.module_name === '重点产业和房地产税收收入' && item.field_name !== '总收入'})
        list1 = list1.sort((a, b) => {
          return Number(a.sort) - Number(b.sort)
        })
        list1.forEach(item => {
          let value = parseFloat(item.numerical_value.substring(0, item.numerical_value.indexOf('亿')))
            zdlist.push([item.field_name, value, Number(item.growth_ratio) || '-', Math.round((value / parseFloat(this.zhongdianTotalValue)) * 10000) / 100])
        })
        const list11 = this.zhongdianchangyePie.slice(0, 1)
        this.zhongdianchangyePie = Object.freeze([
          ...list11,
          ...zdlist
        ])

        let yzsdlist = []
        let yzsdTotal = 0
        this.resData.forEach(item => {
          if (item.module_name === '一轴三带' && item.field_name === '税收收入') {
            yzsdTotal = parseFloat(item.numerical_value) || 0
          }
        })
        let list2 = this.resData.filter(item => {return item.module_name === '一轴三带' && item.field_name !== '税收收入'})
        list2 = list2.sort((a, b) => {
          return Number(a.sort) - Number(b.sort)
        })
        list2.forEach(item => {
          let value = parseFloat(item.numerical_value.substring(0, item.numerical_value.indexOf('亿')))
          yzsdlist.push([item.field_name, value, Number(item.growth_ratio) || '-', Math.round((value / yzsdTotal) * 10000) / 100])
        })
        const list22 = this.yizhousandaiPie.slice(0, 1)
        this.yizhousandaiPie = Object.freeze([
          ...list22,
          ...yzsdlist
        ])

        let lyjjlist = []
        let lyjjTotal = 0
        this.resData.forEach(item => {
          if (item.module_name === '楼宇经济' && item.field_name === '税收收入') {
            lyjjTotal = parseFloat(item.numerical_value) || 0
          }
        })
        let list3 = this.resData.filter(item => {return item.module_name === '楼宇经济' && item.field_name !== '税收收入'})
        list3 = list3.sort((a, b) => {
          return Number(a.sort) - Number(b.sort)
        })
        list3.forEach(item => {
          let value = parseFloat(item.numerical_value)
          lyjjlist.push([item.field_name, value, Number(item.growth_ratio) || '-', Math.round((value / lyjjTotal) * 10000) / 100])
        })
        const list33 = this.lyjjChartData.slice(0, 1)
        this.lyjjChartData = Object.freeze([
          ...list33,
          ...lyjjlist
        ])

        let gyzczlist = []
        let gyzczTotal = 0
        this.resData.forEach(item => {
          if (item.module_name === '工业总产值' && item.field_name === '税收收入') {
            gyzczTotal = parseFloat(item.numerical_value) || 0
          }
        })
        let list4 = this.resData.filter(item => {return item.module_name === '工业总产值' && item.field_name !== '税收收入'})
        list4 = list4.sort((a, b) => {
          return Number(a.sort) - Number(b.sort)
        })
        list4.forEach(item => {
          let value = parseFloat(item.numerical_value.substring(0, item.numerical_value.indexOf('亿')))
          gyzczlist.push([item.field_name, value, Number(item.growth_ratio) || '-', Math.round((value / gyzczTotal) * 10000) / 100])
        })
        const list44 = this.gyzczPie.slice(0, 1)
        this.gyzczPie = Object.freeze([
          ...list44,
          ...gyzczlist
        ])

        let sdfnqlist = []
        let sdgnqTotal = 0
        this.resData.forEach(item => {
          if ( item.module_name === '四大功能区' && item.field_name === '税收收入') {
            sdgnqTotal = parseFloat(item.numerical_value) || 0
          }
        })
        let list5 = this.resData.filter(item => {return item.module_name === '四大功能区' && item.field_name !== '税收收入'})
        list5 = list5.sort((a, b) => {
          return Number(a.sort) - Number(b.sort)
        })
        list5.forEach(item => {
          let value = parseFloat(item.numerical_value)
          sdfnqlist.push([item.field_name, value, Number(item.growth_ratio) || '-', Math.round((value / sdgnqTotal) * 10000) / 100])
        })
        const list55 = this.sidagongnengquPie.slice(0, 1)
        this.sidagongnengquPie = Object.freeze([
          ...list55,
          ...sdfnqlist
        ])

        this.shehuixiaofeiList = this.resData.filter(item => {
          return item.module_name === '社会消费'
        })
        this.waishangtouziList = this.resData.filter(item => {
          return item.module_name === '外商投资'
        })
        this.zhaoshangyinziList = this.resData.filter(item => {
          return item.module_name === '招商引资'
        })
        this.kejichuangxinList = this.resData.filter(item => {
          return item.module_name === '科技创新'
        })
        /* let num = 0
        this.resData.forEach(item => {
          if (item.field_name === '重点产业和房地产税收收入') {
            num += Number(item.numerical_value.substring(0, numerical_value.indexOf('亿'))) || 0
          }
        })
        this.zhongdianchangyeValue = (num || 0) + '亿元' */
      })
      /* getData().then(res => {
        Object.keys(res).forEach(key => {
          let regForDB = /\w+_db$/g;
          if (regForDB.test(key)) {
            let dims = this.dataset[key].slice(0, 1);
            this.dataset[key] = Object.freeze([
              ...dims,
              ...((res[key] || []).map(d => {
                return [d.name, parseFloat(d.value), d.increase || "-", !d.percent || d.percent === "-" ? "-" : Math.round(d.percent * 10000) / 100];
              }))
            ]);
          }
        });
        if (res.statistics && res.statistics[0]) {
          this.dataset.statistics = res.statistics[0];
        }
        console.log(this.dataset, "-");
      }); */
    },
    handleClickYZSD(item) {
      console.log("<<>>>>>>>", item);
      if (item[0] === "南京西路") {
        this.dialogShow = true;
      }
    }
  },
  created() {
    this.$timer.register(this.getData, this);
  }
};
</script>
<style lang="scss" scoped>
.shopText {
  position: absolute;
  top: 0.3rem;
  right: 0.2rem;
  font-size: 0.4rem;
  font-weight: bold;
  color: #4FCFD5;
  cursor: pointer;
}

.clickAble {
  cursor: pointer;
}

.levelt2-select {
  &.m-tabs {
    color: #4E78A4;
  }
}

.autoHeight {
  &.m-tabs-body {
    height: auto;
  }
}

.zsyz {
  line-height: 1.5;

  .label {
    font-size: 0.28rem;
    color: $titleLevel2;
  }

  .value {
    font-size: 0.52rem;
    color: #4FCFD5;

    sub {
      font-size: 0.28rem;
      color: #4FCFD5;
      bottom: 0;
    }
  }

  .increase-wp {
    height: 0.36rem;
    display: flex;
    align-items: center;
  }
}

.legend-label {
  width: 0;
  flex: 1;
}

.legend-percent {
  width: 0.9rem;
  text-align: right;
  color: #fff;
}
</style>
