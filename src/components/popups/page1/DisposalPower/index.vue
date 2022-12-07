<template>
  <div class="dispose-power-wrap">
    <!-- <first-title txt="处置力量">
      <template v-slot:right>
        <div class="right">
          <span class="label">总人数: </span>
          <span class="zaigang">{{disposeOnline | thousandCentimeter}}</span>
          <span class="total"> / {{disposeTotal | thousandCentimeter}}</span>
        </div>
      </template>
    </first-title> -->

    <div class="grid-type-list-wrap">
      <div class="grid-type-list" ref="gridList">
        <div class="no-data" v-if="!gridTypeList.length">暂无数据</div>
        <div class="grid-type-row" v-for="item in disposeMergeList" :key="`grid-${item.name}`">
          <div class="grid-list-title" @click="toggleGrid(item.name, $event)">
            <div class="title-text">
              <span @click.stop="gridClick(item.name)"> {{ item.name !== '-1' ? `网格-${item.name}` : '非网格处置力量' }}</span>
              <span class="iconfont icon-earth" style="color:#ffffff;font-size:0.42rem" v-if="gridClickName === item.name"></span>
              </div>
            <div class="total-person">
              <span class="color-92B9F7">人数：</span>
              <span class="color-FCBF51">{{ $f.thousandCentimeter(item.online) + '/'+ $f.thousandCentimeter(item.total) }}</span>
            </div>
          </div>
          <div class="grid-list-header" v-show="item.name==currentGrid">
            <div class="cell-name">姓名/编号</div>
            <div class="cell-department">部门</div>
            <div class="cell-status">状态</div>
            <div class="cell-control">操作</div>

          </div>
          <div class="grid-list-body" v-show="item.name==currentGrid">
            <div class="grid-list-row-scroll">
              <div
                class="grid-list-row"
                v-for="(row, index) in item.data"
                :key="`disposeRow-${index}`"
                :class="{active: index === activeIndex}"
              >
                <div class="grid-list-row-data">
                  <div
                    class="cell-name"
                    :title="row.name"
                     @click="handleRowClick(index, row)"

                    >
                    <p class="text-ellipsis">{{row.name}}</p>
                  </div>
                  <div class="cell-department">
                    <span class="dropdownTrigger text-ellipsis" :class="{ hasAnther: row.department && Object.prototype.toString.call(row.department) === '[object Array]' && row.department.length > 1 }" @click="showOtherDepartments($event,row.department)">
                      {{ row.department | departmentShow }}
                      <i class="iconfont icon-arrow_left"></i>
                    </span>
                  </div>
                  <div
                    class="cell-status text-ellipsis"
                    :class="`status-${row.status}`"
                    :style="{color: row.status==1 ? '#67c23a':(row.status ==2 ?  '#4d78a4' : '#f96f4f')}"
                    >{{row.status | getStatus}}
                  </div>
                  <div class="cell-control text-ellipsis">
                    <template v-if="row.equipType && row.equipType.indexOf('政务微信') !== -1">
                      <span class="iconfont icon-zhengwuweixin no-click"></span>
                    </template>
                    <template v-if="row.equipment_id">
                      <span class="iconfont icon-gongzuolujing" :class="{ 'is-active': lastSelect.id === row.primeID && lastSelect.selections.indexOf(1) !== -1 }" @click="handleSelect(index, 1, row)"></span>
                      <span class="iconfont icon-video_on" :class="{ 'is-active': lastSelect.id === row.primeID && lastSelect.selections.indexOf(2) !== -1 }" @click="handleSelect(index, 2, row)"></span>
                      <span class="iconfont icon-shipinhuiyi-jingmo" :class="{ 'is-active': lastSelect.id === row.primeID && lastSelect.selections.indexOf(3) !== -1 }" @click="handleSelect(index, 3, row)"></span>
                    </template>
                  </div>
                </div>
                <div class="grid-list-row-stop" v-if="row.status === 2"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid-type-dropdown department" v-show="departmentDropdownShow" ref="departmentDropdown">
            <ul>
              <li v-for="d in departmentDropdownValue" :key="d">
                {{ d }}
              </li>
            </ul>
        </div>
        <div class="grid-type-dropdown phone" v-show="phoneDropdownShow" ref="phoneDropdown">
          电话：{{ phoneDropdownValue }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getBoundingClientRect, getStyleComputedProperty, getBoundingClientRectForParent, findScrollParent } from '@res/utils/dom'
import { getVideoById, getDisposeData3, getPersonDetail } from './api'
// import FirstTitle from '@/components/FirstTitle'
import { getStatus } from '@res/constant'
export default {
  name: 'disposePower',
  inject: ['getGlobalConfig'],
  // components: { FirstTitle },
  data () {
    return {
      layerName: 'soliderLayer',
      gridClickName: '',
      currentPhone: '',
      currentVideo: '',
      videoInteval: '',
      caseClickId: '',
      disposeTotal: '-',
      disposeOnline: '-',
      disposeData: {},
      disposeList: [],
      gridTypeList: [],
      disposeMergeList: [],
      videoDataset: {},
      currentGrid: null, // 当前展开的网格
      departmentDropdownShow: false,
      departmentDropdownValue: [],
      departmentCurrrentLinkDom: null,
      phoneDropdownShow: false,
      phoneDropdownValue: '',
      phoneCurrrentLinkDom: null,
      zIndex: 100,
      reCallTime: 5 * 60 * 1000,
      activeIndex: -1,
      lastSelect: {
        id: null,
        selections: []
      },
      sender: 'EpidemicPreventionForce',
      mapGroupID: this.$_mapProxy.getNewGroupId()
    }
  },
  computed: {
    videoObj () {
      if (this.videoInteval && this.videoDataset[this.videoInteval]) {
        return {
          type: this.videoDataset[this.videoInteval].changeType,
          url: this.videoDataset[this.videoInteval].transcodingAddress
        }
      } else if (this.videoInteval && !this.videoDataset[this.videoInteval]) {
        return {
          type: '',
          url: ''
        }
      } else {
        return null
      }
    }
  },
  filters: {
    getStatus,
    departmentShow (departments) {
      let res = departments || []
      if (Object.prototype.toString.call(res) === '[object Array]') {
        if (res.length > 1) {
          res = res[0] + ' ···'
        } else {
          res = res[0] || ''
        }
      }
      return res
    }
  },
  created () {
    this.reCallData()
    this.$bus.$on('personnelOperationSync', data => {
      if (this.lastSelect.id) {
        this.lastSelect.selections = data.data.operations
      }
    })
    this.registerGridLayer()
  },
  methods: {
    // 注册责任网格图层
    registerGridLayer () {
      this.gridLayer = this.$_mapProxy.registerLayer('gridLayer', '责任网格图层', this.$_mapProxy.MANUAL_GROUP)
        .setParameters({
          type: 'layer',
          isLocate: true,
          data: {
            layers: {
              name: '责任网格',
              where: ''
            }
          },
          renderer: {
            type: 'simple',
            symbol: {
              type: 'line-3d',
              symbolLayers: [
                {
                  type: 'line',
                  size: 5,
                  material: {
                    color: [0, 255, 255, 1]
                  }
                }
              ]
            }
          }
        })
    },
    async handleRowClick (index, row, selections = []) {
      if (this.activeIndex !== index) {
        this.lastSelect.id = row.primeID
        this.lastSelect.selections = selections
        this.activeIndex = index
        const data = await getPersonDetail(row.personCode)
        const pointData = {
          lng: data.detail.lon,
          lat: data.detail.lat,
          ...data.detail,
          status: row.status || data.detail.status
        }
        this.$_mapProxy.goToPosition(pointData.lng, pointData.lat)
        this.$bus.$emit('addNew', {
          key: 'workerPopup',
          componentName: 'workerPopup',
          showClose: true,
          mapData: pointData
        })
      } else {
        this.$_mapProxy.clearPosition()
        this.$_mapProxy.fullExtent()
      }
    },
    handleSelect (activeIndex, operation, row) {
      if (+row.status === 2) return false

      if (this.activeIndex !== activeIndex) {
        this.lastSelect.id = row.primeID
        this.lastSelect.selections = [operation]
        this.handleRowClick(activeIndex, row, [operation])
      } else {
        const index = this.lastSelect.selections.findIndex(d => d === operation)
        let status = 1
        if (index === -1) {
          status = 1
          this.lastSelect.selections.push(operation)
        } else {
          status = 0
          this.lastSelect.selections.splice(index, 1)
        }
        this.$bus.$emit('personnelOperation', {
          status,
          data: {
            operation
          },
          sender: this.sender
        })
      }
    },
    cancelRowClick (self = true) {
      if (this.activeIndex !== -1) {
        this.activeIndex = -1
        this.lastSelect = {
          id: null,
          selections: []
        }
        if (self) {
          this.soliderLayer.close()
        }
      }
    },
    gridClick (name) {
      if (this.gridClickName === name) {
        this.$_mapProxy.closeGrid()
        this.gridClickName = ''
        this.$_mapProxy.fullExtent()
      } else {
        this.gridClickName = name
        this.$_mapProxy.showGrid(this.gridClickName)
      }
    },
    reCallData () {
      this.getData()
      const timer = setInterval(() => {
        this.getData()
      }, this.reCallTime)
      this.$once('hook:beforeDestroy', () => {
        timer && clearInterval(timer)
      })
    },
    async getData () {
      const data = await getDisposeData3()
      this.disposeData = (data && data.data) || {}
      this.gridTypeList = Object.keys(this.disposeData).map(code => {
        return {
          code: code,
          gridName: code,
          name: code,
          parent_code: code
        }
      })
      this.disposeMergeList = this.gridTypeList.map(d => {
        return {
          name: d.code,
          online: '-',
          total: '-',
          data: []
        }
      })
      console.log(this.disposeMergeList, 'disposeMergeList')
      this.mergeData2()
    },
    toggleGrid (grid, e) {
      if (this.currentGrid === grid) {
        this.currentGrid = null
      } else {
        this.currentGrid = grid
        this.goRowPosition(e)
      }
      this.cancelRowClick()
    },
    async showVideo (row) {
      const { personCode } = row
      const { currentVideo } = this
      if (personCode && currentVideo !== personCode) {
        this.currentVideo = personCode
        this.videoInteval = personCode
        if (!this.videoDataset[personCode]) {
          const res = await getVideoById(personCode)
          if (!this.videoDataset.hasOwnProperty(personCode)) {
            this.$set(this.videoDataset, personCode, res[0] || null)
          } else {
            this.videoDataset[personCode] = res[0] || null
          }
        }
      }
    },
    closeVideo () {
      this.currentVideo = ''
      setTimeout(() => {
        this.videoInteval = ''
      }, 600)
    },
    cancelSelect () {
      this.caseClickId = ''
    },
    mergeData2 () {
      const { disposeData, gridTypeList } = this
      const disposeMergeList = []
      const personCollect = {}
      gridTypeList.forEach(item => {
        const obj = {
          name: item.code,
          total: 0,
          online: 0,
          data: []
        }
        if (disposeData[item.code]) {
          const _data = disposeData[item.code]
          obj.total = _data.length
          const _dataObj = {}
          const statusLevel = {
            1: 1,
            2: 3,
            3: 2
          }
          _data.forEach(j => {
            // 人数去重求和
            personCollect[j.primeID] = j.data.status
            if (j.data.status == '1') {
              obj.online += 1
            }
            let department = j.data.department || ''
            if (Object.prototype.toString.call(department) === '[Object Array]') {
              department = department.join(',')
            }
            const status = statusLevel[j.data.status] || 4
            const key = `${status}_${department}`
            if (!_dataObj[key]) {
              _dataObj[key] = []
            }
            _dataObj[key].push({
              primeID: j.primeID,
              _primeID: j.primeID,
              ...j.data
            })
          })
          const sortData = Object.keys(_dataObj).sort((a, b) => {
            const aSplit = a.split('_')
            const bSplit = b.split('_')
            return aSplit[0] !== bSplit[0] ? aSplit[0] - bSplit[0] : _dataObj[a].length - _dataObj[b].length
          })
          obj.data = sortData.map(d => _dataObj[d]).flat(Infinity)
        }
        disposeMergeList.push(obj)
      })

      this.disposeTotal = Object.keys(personCollect).length || 0
      const statusArr = Object.values(personCollect)
      this.disposeOnline = statusArr.filter(v => {
        return v == '1'
      }).length

      this.disposeMergeList = disposeMergeList
      if (disposeMergeList.length > 0) {
        this.currentGrid = disposeMergeList[0].name || null
      }
    },
    setCurrentPhone (e, prefix, phone = '') {
      const { currentPhone } = this
      let newPhone = prefix
      if (newPhone === currentPhone) {
        newPhone = null
      }
      this.currentPhone = newPhone
    },
    showPhone (e, phone) {
      if (!this.$refs.phoneDropdown || !this.$refs.gridList) return false
      if (!this.phoneDropdownShow) {
        this.resetPartCssTest(this.$refs.phoneDropdown)
        this.phoneCurrrentLinkDom = e.currentTarget
        this.phoneDropdownValue = phone
        this.phoneDropdownShow = true
        this.calcPosition(this.$refs.gridList, e.currentTarget, this.$refs.phoneDropdown)
      } else {
        this.hidePhone()
      }
    },
    async calcPosition (parent, link, current) {
      return new Promise((resolve) => {
        this.$nextTick(() => {
          const parentPosition = getBoundingClientRect(parent)
          const linkPosition = getBoundingClientRectForParent(link, parent)
          const currentPosition = getBoundingClientRect(current)
          const styles = getStyleComputedProperty(current)
          let arrowPlacement = 'top-start'
          currentPosition.width += parseInt(styles.marginLeft) + parseInt(styles.marginRight)
          currentPosition.height += parseInt(styles.marginTop) + parseInt(styles.marginBottom)
          if (currentPosition.width - linkPosition.width < 0) {
            currentPosition.width = linkPosition.width
            current.style.minWidth = linkPosition.width + 'px'
          }
          let top = 0
          let _height = ''
          if (linkPosition.docTop + linkPosition.height + currentPosition.height < parent.scrollHeight) {
            top = linkPosition.docTop + linkPosition.height
          } else if (linkPosition.docTop > currentPosition.height) {
            top = linkPosition.docTop - currentPosition.height
            arrowPlacement = 'bottom-start'
          } else {
            top = linkPosition.docTop + linkPosition.height
            _height = parentPosition.height - linkPosition.docTop - linkPosition.height
            if (styles.boxSizing === 'content-box') {
              _height -= (parseInt(styles.paddingTop) + parseInt(styles.paddingBottom))
            }
          }
          let cssText = `top:${top}px;left:${linkPosition.docLeft}px;z-index:${this.zIndex++};`
          if (_height && _height > 0) {
            cssText += `height:${_height}px`
          }
          current.style.cssText += cssText
          current.setAttribute('arrow-placement', arrowPlacement)
          resolve()
        })
      })
    },
    showOtherDepartments (e, departments) {
      if (!departments || Object.prototype.toString.call(departments) !== '[object Array]' || departments.length < 2) return false
      if (!this.$refs.departmentDropdown || !this.$refs.gridList) return false
      if (!this.departmentDropdownShow) {
        this.resetPartCssTest(this.$refs.departmentDropdown)
        this.departmentCurrrentLinkDom = e.currentTarget
        this.departmentDropdownValue = departments
        this.departmentDropdownShow = true
        this.calcPosition(this.$refs.gridList, e.currentTarget, this.$refs.departmentDropdown)
      } else {
        this.hideDepartments()
      }
    },
    resetPartCssTest (ele) {
      const needMoveStyles = ['top', 'left', 'min-width', 'height']
      const cssText = ele.style.cssText
      if (cssText) {
        const newCssText = cssText.split(/;\s*/).filter(style => {
          const styleName = style.split(':')[0]
          return style && needMoveStyles.indexOf(styleName) === -1
        }).join('; ') + ';'
        if (newCssText !== cssText) {
          ele.style.cssText = newCssText
        }
      }
    },
    hideDepartments (e) {
      if (!e || (this.departmentCurrrentLinkDom && !this.departmentCurrrentLinkDom.contains(e.target))) {
        this.departmentCurrrentLinkDom = null
        this.departmentDropdownShow = false
      }
    },
    hidePhone (e) {
      if (!e || (this.phoneCurrrentLinkDom && !this.phoneCurrrentLinkDom.contains(e.target))) {
        this.phoneCurrrentLinkDom = null
        this.phoneDropdownShow = false
      }
    },
    goRowPosition (e) {
      if (!e) return false
      this.$nextTick(() => {
        const scrollParent = findScrollParent(e.currentTarget)
        if (scrollParent && scrollParent.scrollHeight > scrollParent.clientHeight) {
          const info = getBoundingClientRectForParent(e.currentTarget, scrollParent)
          scrollParent.scrollTop = Math.min(info.docTop, scrollParent.scrollHeight - scrollParent.clientHeight)
        };
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.color-92B9F7 {
  color: #FFFFFF;
}
.color-FCBF51 {
  color: #4FCFD5;
}
.right{
  padding-right: 0.2rem;
  text-align: right;
  font-size: 0.32rem;
  color: #92B9F7;
  line-height: 0.72rem;
  .label{
    color:rgba(146, 185, 247, 1);
  }
  .zaigang{
    color: rgba(6, 177, 255, 1);
  }
  .total{
    color:rgba(0, 80, 133, 1);
  }
}
.dispose-power-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  font-size: 0.28rem;
  color: #fff;

  .grid-type-list-wrap {
    width: 100%;
    height: calc(100% - 1rem);
    overflow: hidden;
    .grid-type-list::-webkit-scrollbar {
      width: 1px;
      height: 1px;
    }
    .grid-type-list {
      position: relative;
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      .no-data {
        text-align: center;
        height: 0.6rem;
        line-height: 0.6rem;
      }
      .grid-type-row {
        margin-bottom: 0.2rem;
        background:rgba(216, 216, 216, 0.1);
        padding: 0 0.2rem 0.1rem 0.2rem;

        .grid-list-title {
          display: -webkit-box;
          border-bottom: 0.02rem solid #4e78a4;
          height: 1rem;
          box-sizing: border-box;
          padding: 0 0.1rem;
          line-height: 1rem;
          cursor: pointer;
          .title-text {
            display: flex;
            -webkit-box-flex: 1;
            font-size: 0.36rem;
          }
          .total-person {
            font-size: 0.28rem;
          }
        }
        .grid-list-header {
          display: -webkit-box;
          padding: 0 0.1rem;
          height: 0.64rem;
          line-height: 0.64rem;
          color: #92b9f7;
          font-size: 0.32rem;
        }
        .no-data {
          text-align: center;
          height: 0.58rem;
          line-height: 0.58rem;
          border-top: 0.02rem dashed #4e78a4;
          padding: 0 0.1rem;
        }
        .grid-list-body {
          width: 100%;
          .grid-list-row-scroll {
            width: 100%;
            max-height: 3.5rem;
            overflow-y: auto;
            &::-webkit-scrollbar {
              width: 0.06rem;
              height: 0.06rem;
            }

            &::-webkit-scrollbar-track-piece {
              background-color: transparent;
              margin: 0rem;
            }

            &::-webkit-scrollbar-thumb {
              background: #40abb2;
              min-height: 0.2rem;
              min-width: 0.2rem;
              border-radius: 0.1rem;
            }

            &::-webkit-scrollbar-thumb:vertical:hover {
              background: #555555;
            }

            &::-webkit-scrollbar-thumb:horizontal:hover {
              background: #555555;
            }
            .row-select {
              height: 0.58rem;
              line-height: 0.58rem;
              background: rgba(37, 115, 239, 0.4);
              border: 0.02rem solid rgba(37, 115, 239, 1);
              box-sizing: border-box;
            }
            .grid-list-row {
              position: relative;
              &.active {
                background: rgba(#4FCFD5, 0.4)
              }
              .grid-list-row-stop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(78, 120, 164, 0);
                cursor: not-allowed;
                z-index: 2;
              }
              .grid-list-row-data {
                display: flex;
                height: 0.58rem;
                line-height: 0.58rem;
                border-top: 0.02rem dashed #4e78a4;
                padding: 0 0.1rem;
                box-sizing: border-box;
                .status-处置中 {
                  color: #fcbf51;
                }
              }
              .video-wrap {
                .video-main {
                  width: 100%;
                  height: 5.6rem;
                  box-sizing: border-box;
                  margin: 0.1rem 0;
                  border: 0.02rem solid #679df4;
                }
                .show,
                .hide {
                  -moz-transform-origin: 50% 0%;
                  -ms-transform-origin: 50% 0%;
                  -o-transform-origin: 50% 0%;
                  -webkit-transform-origin: 50% 0%;
                  transform-origin: 50% 0%;
                }
                .show {
                  display: block;
                  max-height: 9999px;
                  -moz-transform: scaleY(1);
                  -ms-transform: scaleY(1);
                  -o-transform: scaleY(1);
                  -webkit-transform: scaleY(1);
                  transform: scaleY(1);
                  animation: showAnimation 0.5s ease-in-out;
                  -moz-animation: showAnimation 0.5s ease-in-out;
                  -webkit-animation: showAnimation 0.5s ease-in-out;
                  -moz-transition: max-height 1s ease-in-out;
                  -o-transition: max-height 1s ease-in-out;
                  -webkit-transition: max-height 1s ease-in-out;
                  transition: max-height 1s ease-in-out;
                }
                .hide {
                  max-height: 0;
                  -moz-transform: scaleY(0);
                  -ms-transform: scaleY(0);
                  -o-transform: scaleY(0);
                  -webkit-transform: scaleY(0);
                  transform: scaleY(0);
                  animation: hideAnimation 0.4s ease-out;
                  -moz-animation: hideAnimation 0.4s ease-out;
                  -webkit-animation: hideAnimation 0.4s ease-out;
                  -moz-transition: max-height 0.6s ease-out;
                  -o-transition: max-height 0.6s ease-out;
                  -webkit-transition: max-height 0.6s ease-out;
                  transition: max-height 0.6s ease-out;
                }
              }
            }
          }
        }
        .cell-name {
          width: 2rem;
          position: relative;
          cursor: pointer;
          .phone-wrap {
            position: absolute;
            bottom: -0.53rem;
            left: 0rem;
            width: auto;
            min-width: 2rem;
            min-height: 0.5rem;
            padding: 0.1rem;
            line-height: 0.3rem;
            z-index: 100;
            background: -webkit-gradient(
              linear,
              left top,
              left bottom,
              to(rgba(84, 88, 169, 0.7))
            );
            border: 0.02rem solid #4e78a4;
            border-radius: 0.05rem;
            cursor: text;
            color: #fff;
            font-size: 0.32rem;
            white-space: nowrap;
            &.none {
              display: none;
            }
          }
        }
        .cell-touxiang {
          width: 1.4rem;
        }
        .img-wrap {
          margin-top: 8px;
          width: 0.6rem;
          background: pink;
        }
        .cell-department {
          width: 3.0rem;
          .z-dropdown-link {
            max-width: 100%;
          }
        }
        .cell-device {
          width: 2.0rem;
          cursor: pointer;
          .color-47bfa5 {
            color: #47bfa5
          }
          .color-FCBF51 {
            color: #fcbf51;
          }
        }
        .cell-status {
          width: 2rem;
          text-align: center;
        }
        .cell-task {
          width: 1.8rem;
          text-align: right;
        }
        .cell-control {
          -webkit-box-flex: 1;
          text-align: center;
          span {
            margin-right: 10px;
            cursor: pointer;
            color: #2aa98b;
            font-size: 120%;
            &:last-child {
              margin-right: 0;
            }
            &.no-click {
              cursor: default;
            }
            &.is-active {
              color: #FCBF51;
            }
          }
        }
        .grid-list-body .cell-control {
          text-align: left;
        }
      }
    }
    .grid-type-dropdown {
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 5px;
      margin: 10px 0px;
      padding: 10px;
      background-color: rgba(#2573EF, 0.9);
      font-size: 24px;
      line-height: 36px;
      color: #fff;
      &[arrow-placement="top-start"] {
        &::after {
          position: absolute;
          top: -10px;
          left: 10px;
          content: "";
          border-width: 5px;
          border-style: solid;
          border-color: transparent transparent rgba(#2573EF, 0.9) transparent;
        }
      }
      &[arrow-placement="bottom-start"] {
        &::after {
          position: absolute;
          bottom: -10px;
          left: 10px;
          content: "";
          border-width: 5px;
          border-style: solid;
          border-color: rgba(#2573EF, 0.9) transparent transparent transparent;
        }
      }
    }
  }
  .btn-video-conferencing,
  .btn-government-weChat {
    position: absolute;
    bottom: 0.24rem;
    width: 4.9rem;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    color: #fff;
    font-size: 0.44rem;
    .iconfont {
      color: #fff;
    }
  }
  .btn-video-conferencing {
    left: 0.44rem;
    background: rgba(78, 120, 164, 0.4);
    border: 0.02rem solid rgba(78, 120, 164, 1);
    .iconfont {
      margin-right: 0.3rem;
    }
  }
  .btn-government-weChat {
    right: 0.48rem;
    background: rgba(42, 169, 139, 0.4);
    border: 0.02rem solid rgba(42, 169, 139, 1);
    .iconfont {
      margin-right: 0.4rem;
    }
  }
}
.dropdownTrigger {
  position: relative;
  display: inline-block;
  max-width: 100%;
  .iconfont {
    position: absolute;
    display: none;
    top: 50%;
    right: 0px;
    font-size: 0.20rem;
    transform-origin: center center;
    transform: translateY(-50%) rotateZ(-90deg);
    color: #fff;
  }
  &.hasAnther {
    cursor: pointer;
    padding-right: 30px;
    .iconfont {
      display: block;
    }
  }
}
@keyframes showAnimation {
  0% {
    transform: scaleY(0.1);
  }

  40% {
    transform: scaleY(1.04);
  }

  60% {
    transform: scaleY(0.98);
  }

  80% {
    transform: scaleY(1.04);
  }

  100% {
    transform: scaleY(0.98);
  }

  80% {
    transform: scaleY(1.02);
  }

  100% {
    transform: scaleY(1);
  }
}
@keyframes hideAnimation {
  0% {
    transform: scaleY(1);
  }

  60% {
    transform: scaleY(0.98);
  }

  80% {
    transform: scaleY(1.02);
  }

  100% {
    transform: scaleY(0);
  }
}
</style>
