<template>
  <wrap-title class="gradient-bg" icon="icon-zonghezhili" :txt="title">
    <m-tabs slot="level-title" v-model="tab" :tabs="tabs" ref="mainTab" @change="handleChangeForTabItem" :autoChange="false"></m-tabs>
    <span slot="center" v-show="tab !== 'overview' && tab !=='manager'" class="back" @click="handleClickForBack">[返回上一级]</span>
    <m-tabs-body :tab="tab">
      <m-tabs-body-item name="manager" @mouseenter.native="handleMouse('mainTab', 'enter')" @mouseleave.native="handleMouse('mainTab', 'leave')">
        <m-row gutter="0.1rem">
          <m-column class="command-item" :span=" 1">
            <div class="command-btn" @click="tab='daily'"><img :src="require('./images/1.png')"/>日常指挥</div>
          </m-column>
          <m-column  class="command-item"  :span=" 1">
            <div class="command-btn" @click="tab='yingji'"><img :src="require('./images/2.png')"/>应急指挥</div>
          </m-column>
          <m-column  class="command-item"  :span=" 1">
            <div class="command-btn" @click="tab='zhuanxiang'"><img :src="require('./images/3.png')"/>专项指挥</div>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="overview" @mouseenter.native="handleMouse('mainTab', 'enter')" @mouseleave.native="handleMouse('mainTab', 'leave')">
        <m-row gutter="0.1rem">
          <m-column v-for="item in items" :key="item.name" :span="item.span || 1">
            <overview-item
            @click="handleClickItem"
            v-bind="item"
            :dataset="itemsData[item.name] || dataset[item.prop]"
            customClass="style2" style="cursor: pointer"></overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="daily" @mouseenter.native="handleMouse('mainTab', 'enter')" @mouseleave.native="handleMouse('mainTab', 'leave')">
        <div class="daily-wrap" @click="dialogVisible=true">
          <div class="left">
            <div class="label">指挥长</div>
            <div class="value">谢志彬</div>
          </div>
          <div class="split"></div>
          <div class="right">
            <div class="item" v-for="(item , index) in deps" :key="`dep-${index}`">
              <div class="label">{{item.label}}</div>
            <div class="value">{{item.value}}</div>
            </div>
          </div>
        </div>
      </m-tabs-body-item>
      <m-tabs-body-item name="zhuanxiang" @mouseenter.native="handleMouse('mainTab', 'enter')" @mouseleave.native="handleMouse('mainTab', 'leave')">
        <div class="zhuanxiang-wrap">
          <div class="item" v-for="(item, index) in zhuanxiang" :key="`zx-${index}`">
            {{item.label}}
          </div>
        </div>
      </m-tabs-body-item>
      <m-tabs-body-item name="yingji" @mouseenter.native="handleMouse('mainTab', 'enter')" @mouseleave.native="handleMouse('mainTab', 'leave')">
        <div class="yingji">
          <div class="wrap" v-if="!showYingjiList">
            <div class="left">
              <div class="item" @click="handleShowList('区委部门')">区委部门</div>
              <div class="item" @click="handleShowList('区政府部门')">区府部门</div>
            </div>
            <div class="center">
              <div class="item" @click="handleShowList('区应急局')">区应急局</div>
            </div>
            <div class="right">
              <div class="item" @click="handleShowList('应急管理单元')">应急管理单元</div>
              <div class="item" @click="handleShowList('区管国企')">区管国企</div>
              <div class="item" @click="handleShowList('属地部门')">属地部门</div>
            </div>
          </div>
          <div class="list-wrap" v-else>
            <m-list :headers="headers" :dataset="tableData"></m-list>
            <div class="goback" @click="showYingjiList=false"></div>
          </div>
        </div>
      </m-tabs-body-item>
      <m-tabs-body-item name="sgy" class="detail">
        <m-row gutter="0.1rem">
          <m-column width="20%">
            <overview-item class="active" v-if="activeItem" v-bind="activeItem" customClass="style2"></overview-item>
          </m-column>
          <m-column width="80%">
            <chart-line :chartData="dataset.sgy_chartData" :colors="colors" :smooth="true"></chart-line>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="dlgy">
        <m-row gutter="0.1rem">
          <m-column width="20%">
            <overview-item v-if="activeItem" v-bind="activeItem" customClass="style2"></overview-item>
          </m-column>
          <m-column width="30%">

          </m-column>
          <m-column width="50%"></m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="rqgy">
        <m-row gutter="0.1rem">
          <m-column width="20%">
            <overview-item v-if="activeItem" v-bind="activeItem" customClass="style2"></overview-item>
          </m-column>
          <m-column width="30%"></m-column>
          <m-column width="50%"></m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="ljcl">
        <m-row gutter="0.1rem">
          <m-column width="20%">
            <overview-item v-if="activeItem" v-bind="activeItem" customClass="style2"></overview-item>
          </m-column>
          <m-column width="30%"></m-column>
          <m-column width="50%"></m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="wscl">
        <m-row gutter="0.1rem">
          <m-column width="20%">
            <overview-item v-if="activeItem" v-bind="activeItem" customClass="style2"></overview-item>
          </m-column>
          <m-column width="30%"></m-column>
          <m-column width="50%"></m-column>
        </m-row>
      </m-tabs-body-item>
    </m-tabs-body>
    <MDialog :dialogVisible.sync="dialogVisible" appendDom="#MapContainer" :extraCss="extraCss">
      <img style="width: 100%;height: 100%; object-fit: contain;border: 1px solid #154FA3;" :src="require('./images/daily-command.png')"/>
    </MDialog>
    <m-dialog
      :dialog-visible.sync="visible"
      append-dom="#MapContainer"
      :destroy-after-close="true"
    >
      <m-pdf
        v-if="pdfUrl"
        :src="pdfUrl"
        mode="ppt"
      />
    </m-dialog>
    <!-- <div class="schedule" v-if="tab==='manager'"  @click="handleReportView"><span class="iconfont icon-renyuankaohe"></span></div> -->
  </wrap-title>
</template>
<script>
import MDialog from '@/components/MDialog/index'
import WrapTitle from '@/components/MTitle/WrapTitle'
import MTabs from '@/components/MTabs'
import MRow from '@/components/Layout/MRow'
import MColumn from '@/components/Layout/MColumn'
import OverviewItem from '@/components/OverviewItem'
import MTabsBody from '@/components/MTabsBody/MTabsBody'
import MTabsBodyItem from '@/components/MTabsBody/MTabsBodyItem'
import ChartLine from '@/components/Charts/Line/ChartLineForCompare'
import MList from '@/components/MList/index'
import MPdf from '@/components/MPDF'

import { getData, getData2, getListData1, getListData2, getHotlineData, getDeviceRate, getDeviceRate2 } from './api'
import { statisticsForKey } from '@/utils/tools'

export default {
  name: 'OverView',
  components: {
    MDialog,
    MList,
    WrapTitle,
    MTabs,
    MRow,
    MColumn,
    OverviewItem,
    MTabsBody,
    MTabsBodyItem,
    ChartLine,
    MPdf
  },
  inheritAttrs: false,
  data () {
    const lastIndex = window.location.href.lastIndexOf('/')
    const prefix = window.location.href.substring(0, lastIndex + 1)
    return {
      visible: false,
      prefix: prefix,
      pdfUrl: '',
      extraCss: {
        top: '3.3rem',
        left: '3.5rem',
        width: '18rem',
        height: '15.12rem'
      },
      dialogVisible: false,
      deps: [
        {
          label: '督  查',
          value: '张纬臣'
        },
        {
          label: '网信办',
          value: '李晟晖'
        },
        {
          label: '公  安',
          value: '钱国庆'
        },
        {
          label: '建管委',
          value: '朱琳俪'
        },
        {
          label: '应急局',
          value: '王姝'
        },
        {
          label: '地区办',
          value: '潘文波'
        }
      ],
      zhuanxiang: [
        {
          label: '文明创建'
        },
        {
          label: '卫生创建'
        },
        {
          label: '重大活动'
        },
        {
          label: '重大节日'
        }
      ],
      tabs: Object.freeze([
        { label: '指挥体系', value: 'manager' },
        { label: '城市运行', value: 'overview' }
      ]),
      colors: Object.freeze(['#4FCFD5', '#DED7D7']),
      colors2: Object.freeze(['#30BC9B', '#92B9F7']),
      items: Object.freeze([
        { icon: 'icon-chuzhililiang1', name: '处置力量', nameUnit: '(人)', showIncrease: false, prop: 'staff_total' },
        // { icon: 'icon-zaigangrenshu', name: '在岗人数', nameUnit: '(人)', showIncrease: false, prop: 'staff_online' },
        { icon: 'icon-ganzhi', name: '智能感知预警', showIncrease: false, valueUnit: '%', prop: 'zngzyj' },
        { icon: 'icon-wanggeanjian', name: '网格案件数', nameUnit: '(件)', showIncrease: false, prop: 'case_count' },
        { icon: 'icon-rexian', span: 1.2, name: '12345热线', nameUnit: '(件)', showIncrease: false, prop: 'recyclable_waste' }
      ]),
      options: Object.freeze([
        { label: '本周', value: 'currentWeek' },
        { label: '本月', value: 'currentMonth' }
      ]),
      tab: 'overview',
      activeItem: null,
      option: 'currentWeek',
      dataset: {
        zngzyj: {
          value: '-'
        },
        sgy_chartData: [
          ['水供应趋势', 'xxx', 'xxx2'],
          ['11.02', 500, 400],
          ['11.03', 300, 199],
          ['11.04', 350, 400],
          ['11.05', 210, 120],
          ['11.06', 480, 300],
          ['11.07', 360, 250],
          ['11.08', 200, 100]
        ],
        sgy_chartData2: [
          ['街镇用水量', 'xxx', 'xxx2'],
          ['南西', 200, 100],
          ['静安寺', 200, 100],
          ['共和新', 200, 100],
          ['大宁路', 200, 100],
          ['曹家渡', 200, 100],
          ['天目西', 200, 100]
        ]
      },
      itemsData: {},
      headers: [
        {
          label: '部门',
          prop: '部门'
        },
        {
          label: '姓名',
          prop: '姓名'
        },
        {
          label: '职务',
          prop: '职务'
        },
        {
          label: '办公电话',
          prop: '办公电话'
        },
        {
          label: '手机',
          prop: '手机'
        }
      ],
      list: [],
      activeDep: null,
      showYingjiList: false
    }
  },
  computed: {
    tableData () {
      if (this.activeDep) {
        return this.list[this.activeDep] || []
      } else {
        return this.list
      }
    },
    title () {
      let res = '城市运行'
      if (this.activeItem) {
        res += `-${this.activeItem.name}`
      }
      return res
    }
  },
  methods: {
    handleClickItem (item) {
      if (item === '处置力量') {
        this.$_mapProxy.getMap()._openPopup('PowerPopup', {})
      }
    },
    handleReportView () {
      this.visible = true
      this.pdfUrl = this.prefix + '/pdf/zhiban.pdf'
    },
    handleShowList (type) {
      this.activeDep = type
      this.showYingjiList = true
    },
    handleChangeForTabItem () {
      // todo
    },
    handleClickForOverviewItem (item) {
      this.tab = item.prop
      this.activeItem !== item && (this.activeItem = item)
    },
    handleClickForBack () {
      this.tab = 'manager'
      this.activeItem = null
      this.showYingjiList = null
    },
    getData () {
      getDeviceRate2().then(res => {
        this.dataset.zngzyj = {
          value: res.data_value
        }
      })
      getData().then(res => {
        if (res.api) {
          // let result = Math.round(res.api.device_online_percent * 100) / 100
          // this.dataset.zngzyj = {
          //   value: result > 95 ? result : (95 + Math.random() + 1).toFixed(2)
          // }
          
        }
        // if (res.apiData) {
        //   this.dataset.staff_total = {
        //     value: res.apiData.staff_total
        //   }
        //   this.dataset.case_count = {
        //     value: res.apiData.case_count
        //   }
        //   this.dataset.staff_online = {
        //     value: res.apiData.staff_online
        //   }
        // }
        let tmp = {};
        (res.items || []).map(item => {
          tmp[item.name] = item
        })
        this.itemsData = tmp

        getHotlineData().then(res => {
          let result = res.data || {}
          this.itemsData['12345热线'].value = result.today || '-'
        })
      })

      getData2().then(res => {
        this.dataset.staff_total = {
          value: res.staff_total
        }
        this.dataset.case_count = {
          value: res.case_count
        }
        this.dataset.staff_online = {
          value: res.staff_online
        }
      })
      Promise.all([getListData1(), getListData2()]).then(res => {
        this.list = statisticsForKey('关联', [...res[0].raw_data, ...res[1].raw_data.map(item => {
          return {
            部门: item['单位'],
            姓名: item['分管领导'],
            职务: item['分管领导职务'],
            办公电话: item['分管领导固定电话'],
            手机: item['分管领导移动电话']
          }
        })].map((item, index) => {
          return {
            ...item,
            id: index
          }
        }))
      })
    },
    handleMouse (ref, mouse) {
      if (mouse === 'enter') {
        this.$refs[ref].stopTimer()
      } else {
        this.$refs[ref].startTimer()
      }
    }
  },
  created () {
    this.$timer.register(this.getData, this)
  }
}
</script>
<style lang="scss" scoped>
.schedule{
  position: absolute;
  top: 0.3rem;
  left: 7rem;
  font-size: 0.4rem;
  cursor: pointer;
  width: 2rem;
  height: 0.32*2rem;
  background: linear-gradient(180deg, rgba(102, 157, 244, 0.4) 0%, rgba(21, 79, 163, 0.4) 100%);
  border-radius: 0.02*2rem;
  text-align: center;
  line-height: 0.64rem;
}
.yingji{
  width: 100%;
  height: 3rem;
  position: relative;
  .wrap{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .left{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      height: 2rem;

      .item{
        width: 2.84*2rem;
        height: 0.8rem;
        background: linear-gradient(138deg, rgba(98, 222, 187, 0.15) 0%, rgba(0, 161, 228, 0.15) 100%);
        border: 1px solid;
        border-image: linear-gradient(90deg, rgba(81, 231, 228, 0.21), rgba(0, 195, 172, 0.16)) 1 1;

        font-size: 0.24*2rem;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 0.8rem;
        text-align: center;
        cursor: pointer;
      }
    }
    .center{
      .item{
        width: 3.34*2rem;
        height: 0.64*2rem;
        background: linear-gradient(139deg, rgba(30, 178, 255, 0.56) 0%, rgba(0, 206, 255, 0.78) 100%);
        border-radius: 2px;
        opacity: 0.58;
        border: 1px solid;
        border-image: linear-gradient(137deg, rgba(3, 195, 255, 1), rgba(7, 222, 255, 1)) 1 1;

        font-size: 0.24*2rem;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 0.64*2rem;
        text-align: center;
        cursor: pointer;
      }
    }
    .right{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      height: 2.5rem;
      .item{
        width: 2.84*2rem;
        height: 0.32*2rem;
        background: linear-gradient(180deg, rgba(84, 88, 169, 0.2) 0%, rgba(21, 79, 163, 0.4) 100%);
        border-radius: 0.04rem;
        border: 1px solid;
        border-image: linear-gradient(130deg, rgba(150, 128, 200, 0.12), rgba(95, 72, 157, 0.33)) 1 1;

        font-size: 0.42rem;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 0.64rem;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .list-wrap{
    width: 100%;
    height: 2.6rem;
    position: relative;
    .goback{
      position: absolute;
      top: -0.5rem;
      right: 0.2rem;
      width: 0.4rem;
      height: 0.4rem;
      background: url("./images/goback.png") center center / contain no-repeat;
      cursor: pointer;
    }
  }

}
.zhuanxiang-wrap{
  display: flex;
  justify-content: space-around;
  align-items: center;
  .item{
    width: 2.24*2rem;
    height: 0.56*2rem;
    background: linear-gradient(360deg, rgba(0, 48, 124, 0.69) 0%, rgba(21, 79, 163, 0.4) 100%);
    border-radius: 0.04*2rem;
    border: 1px solid #2E62B4;
    text-align: center;
    line-height: 0.56*2rem;

    font-size: 0.21*2rem;
    font-weight: 400;
    color: #FFFFFF;
  }
}
.command-item{
  display: flex;
  justify-content: center;
  align-content: center;

  .command-btn{
    width: 1.07*4rem;
    height: 0.32*4rem;
    background: linear-gradient(180deg, rgba(102, 157, 244, 0.4) 0%, rgba(21, 79, 163, 0.4) 100%);
    border-radius: 0.02*2rem;
    border: 1px solid #669DF4;
    text-align: center;

    font-size: 0.24*2rem;
    font-weight: 400;
    color: #FFFFFF;
    // line-height: 0.64rem;
    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
    >img{
      width: 0.37*2rem;
      height: 0.4*2rem;
      object-fit: contain;
    }
  }
}
.daily-wrap{
  width: 100%;
  display: flex;
  align-items: center;
  min-width: 0;
  .left{
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .label{
      font-size: 0.24*2rem;
      font-weight: 500;
      color: #FFFFFF;
    }
    .value{
      font-size: 0.24*2rem;
      font-weight: bold;
      color: #00F4FF;
    }

  }
  .split{
    width: 0.02rem;
    height: 1.6rem;
    background: #4E78A4;
  }
  .right{
    flex: 3;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    .label{
      font-size: 0.21*2rem;
      font-weight: 500;
      color: #FFFFFF;
    }
    .value{
      font-size: 0.21*2rem;
      font-weight: 500;
      color: #00F4FF;
    }
    .item{
      width: 33%;
      // margin-bottom: 0.2*2rem;
      line-height: 1rem;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
}
.m-tabs-body__item {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.back {
  cursor: pointer;
  font-size: 0.24rem;
  color: #A8C7F9;
}
.detail {
  .m-row {
    height: 100%;
  }
  .m-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .v-chart-container {
    height: 0;
    flex: 1;
  }
  .active {
    /deep/ {
      .overview-item__name {
        color: $titleActive;
        font-weight: bold;
      }
    }
  }
}
</style>
