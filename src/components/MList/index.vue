<template>
  <div class="m-list" :class="{ 'is-adaption': adaption }">
    <div class="list-header">
      <div
        v-for="(item, index) in headers"
        :key="index"
        class="list-header__item"
        :class="{ 'is-width': !!item.width }"
        :style="{
          flex: !item.width ? item.ratio || 1 : '',
          width: item.width,
          'text-align': item.align || (index === 0 ? 'left' : 'center'),
          'background-color': item.bgColor,
          fontSize: item.fontSize
        }"
      >
        <div class="cell" v-if="item.filter">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              {{ item.label }} <i class="iconfont icon-arrow-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <dropdown-item v-for="(filterItem, i) in columnsFilter[item.prop].filters" :is-active="filter[item.prop] && filter[item.prop].indexOf(filterItem.value)  !== -1" :key="i" @click="handleClickForFilter(item, filterItem)">{{ filterItem.label }}</dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="cell isPointer" @click="handleClickForSort(item)" v-else-if="item.sort">
          {{ item.label }}
          <i class="iconfont icon-sort"></i>
        </div>
        <div class="cell" v-else-if="item.headerSlot">
          <slot :name="item.headerSlot" v-bind:item="item"></slot>
        </div>
        <div class="cell" v-else v-html="item.label"></div>
      </div>
    </div>
    <div ref="list-body" class="list-body">
      <p v-if="!tableData || !tableData.length" class="noDataTip">暂无数据</p>
      <RecycleScroller
        v-else-if="adaption"
        class="list-body__content"
        :items="tableData"
        :item-size="rowHeightPx"
        :key-field="rowKey"
        v-slot="{ item }"
      >
        <div
          :key="item[rowKey]"
          class="list-body__row"
          :class="{
            canClick: rowClick && !hasCellClick,
            'is-active': active === item[rowKey]
          }"
          @click="handleRowClick(item[rowKey], item)"
        >
          <div
            v-for="(column, hi) in headers"
            :key="column.prop"
            class="list-body__column"
            :class="{
              'is-width': !!column.width,
              canClick: column.isClick,
              'active-cell': activeCell === item[rowKey] + '_' + column.prop
            }"
            :style="{
              flex: !column.width ? column.ratio || 1 : '',
              width: column.width,
              'text-align': column.align || (hi === 0 ? 'left' : 'center'),
              'background-color': column.bgColor,
              height: rowHeightPx + 'px'
            }"
            @click="handleCellClick(item, column, item[rowKey] + '_' + column.prop)"
          >
            <div v-if="column.type === 'process'" class="cell">
              <div class="formatter-process">
                <div
                  class="formatter-process__value"
                  :style="{ backgroundColor: column.processColor, width: `${item[column.prop] || 0}%` }"
                ></div>
              </div>
            </div>
            <div
              v-else-if="column.type === 'number'"
              class="cell"
            >{{ item[column.prop] | thousandCentimeter }}</div>
            <div
              v-else-if="column.type === 'date'"
              class="cell"
            >{{ (column.isSecond ? item[column.prop] * 1000 : item[column.prop]) | formatterDate(column.dateFmt || 'yyyy-MM-dd hh:mm:ss') }}</div>
            <div
              v-else-if="column.type === 'img'"
              @click.stop
              class="cell"
            >
              <!-- <template v-if="item[column.prop]">
                <img v-magnifier="item[column.prop]" :src="item[column.prop] | getImgUrl" alt="">
              </template>
              <template v-else>
                暂无图片
              </template> -->
            </div>
            <div
              v-else-if="column.type === 'custom' && column.formatter"
              class="cell"
              v-html="column.formatter(item, column.prop)"
            ></div>
            <div v-else-if="column.type === 'slot'" >
              <slot :name="column.slot" v-bind:row="item"></slot>
            </div>
            <div v-else class="cell">{{ item.hasOwnProperty(column.prop) ? item[column.prop] : "-" }}</div>
          </div>
        </div>
      </RecycleScroller>
      <div class="list-body__content" v-else>
        <div
          v-for="item in tableData"
          :key="item[rowKey]"
          class="list-body__row"
          :class="{
            canClick: rowClick && !hasCellClick,
            'is-active': active === item[rowKey]
          }"
          @click="handleRowClick(item[rowKey], item)"
        >
          <div
            v-for="(column, hi) in headers"
            :key="column.prop"
            class="list-body__column"
            :class="{
              'is-width': !!column.width,
              canClick: column.isClick,
              'active-cell': activeCell === item[rowKey] + '_' + column.prop
            }"
            :style="{
              flex: !column.width ? column.ratio || 1 : '',
              width: column.width,
              'text-align': column.align || (hi === 0 ? 'left' : 'center'),
              'background-color': column.bgColor,
              height: rowHeightPx + 'px'
            }"
            @click="handleCellClick(item, column, item[rowKey] + '_' + column.prop)"
          >
            <div v-if="column.type === 'process'" class="cell">
              <div class="formatter-process">
                <div
                  class="formatter-process__value"
                  :style="{ backgroundColor: column.processColor, width: `${item[column.prop] || 0}%` }"
                ></div>
              </div>
            </div>
            <div
              v-else-if="column.type === 'number'"
              class="cell"
            >{{ item[column.prop] | thousandCentimeter }}</div>
            <div
              v-else-if="column.type === 'date'"
              class="cell"
            >{{ (column.isSecond ? item[column.prop] * 1000 : item[column.prop]) | formatterDate(column.dateFmt || 'yyyy-MM-dd hh:mm:ss') }}</div>
            <div
              v-else-if="column.type === 'img'"
              @click.stop
              class="cell"
            >
              <!-- <template v-if="item[column.prop]">
                <img v-magnifier="item[column.prop]" :src="item[column.prop] | getImgUrl" alt="">
              </template>
              <template v-else>
                暂无图片
              </template> -->
            </div>
            <div
              v-else-if="column.type === 'custom' && column.formatter"
              class="cell"
              v-html="column.formatter(item, column.prop)"
            ></div>
            <div v-else-if="column.type === 'slot'" >
              <slot :name="column.slot" v-bind:row="item"></slot>
            </div>
            <div v-else class="cell">{{ item.hasOwnProperty(column.prop) ? item[column.prop] : "-" }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 相比2.0额外增加了筛选
// import ZDropdownLink from "@/components/ZDropdown/ZDropdownLink";
// import ZDropdownMenu from "@/components/ZDropdown/ZDropdownMenu";
// import ZDropdownItem from "@/components/ZDropdown/ZDropdownItem";
// import magnifier from "@/components/MImageView/directive.js";
import DropdownItem from "./dropdownItem";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
let uuid = 1;
// let selectId = 0;
export default {
  name: "MTable",
  inject: {
    createFnForCalcRealPx: {
      from: "createFnForCalcRealPx",
      default: val => val
    }
  },
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    dataset: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: String,
      default: "id"
    },
    rowClick: {
      type: Boolean,
      default: true
    },
    rowHeight: {
      type: Number,
      default () {
        return 0.64;
      }
    },
    adaption: {
      type: Boolean,
      default: true
    }
  },
  components: {
    RecycleScroller,
    DropdownItem
    // ZDropdownLink,
    // ZDropdownMenu,
    // ZDropdownItem
  },
  // directives: { magnifier },
  filters: {
    getImgUrl (data) {
      return Object.prototype.toString.call(data) === "[object Array]" ? data[0] : data;
    }
  },
  data () {
    return {
      id: uuid++,
      active: null,
      activeCell: null,
      tableData: [],
      filter: {},
      sortProp: "",
      sortType: ""
    };
  },
  watch: {
    dataset: {
      handler () {
        this.updateTableData();
      }
    },
    headers: {
      handler () {
        this.filter = {};
      }
    }
  },
  mounted () {
    this.updateTableData();
  },
  computed: {
    hasCellClick () {
      return (this.headers || []).some(item => item.isClick);
    },
    columnsFilter () {
      let getFromData = false;
      const filterObj = {};
      (this.headers || []).forEach(column => {
        if (column.filter && column.prop) {
          filterObj[column.prop] = {
            filters: column.filters || null,
            filterMethod: column.filterMethod || null
          };
          if (!filterObj[column.prop].filters) {
            getFromData = true;
          }
        }
      });
      if (getFromData) {
        const keysNeedFromFilterData = Object.keys(filterObj).filter(key => !filterObj[key].filters);
        this.dataset.reduce((fobj, item) => {
          keysNeedFromFilterData.forEach(key => {
            !fobj[key].filters && (fobj[key].filters = new Set());
            fobj[key].filters.add(item[key]);
          });
          return fobj;
        }, filterObj);
        keysNeedFromFilterData.forEach(key => {
          filterObj[key].filters = Array.from(filterObj[key].filters || []).map(d => ({ label: d, value: d }));
        });
      }
      return filterObj;
    },
    rowHeightPx () {
      return this.createFnForCalcRealPx(this.rowHeight);
    }
  },
  methods: {
    cancel (self = true) {
      if (this.active !== null) {
        this.active = null;
        if (self) {
          this.$emit("rowClick", null);
        }
      }
    },
    handleRowClick (index, row) {
      if (!this.rowClick || this.hasCellClick) { return false; }
      if (this.active !== index) {
        this.active = index;
        this.$emit("rowClick", row);
      } else {
        this.cancel();
      }
    },
    handleCellClick (row, column, index) {
      if (!column.isClick) return false;
      if (this.activeCell !== index) {
        this.activeCell = index;
        this.$emit("cellClick", { row: row, cell: row[column.prop] });
      } else {
        this.cancelCell();
      }
    },
    cancelCell (self = true) {
      // console.log("cell换列表取消", this.activeCell);
      if (this.activeCell !== -1) {
        this.activeCell = -1;
        if (self) {
          this.$emit("cellClick", { row: null, cell: null });
        }
      }
    },
    handleClickForFilter (item, filterItem) {
      if (item.prop && !this.filter[item.prop]) {
        this.$set(this.filter, item.prop, []);
      }
      const findIndex = this.filter[item.prop].findIndex(d => d === filterItem.value);
      if (findIndex === -1) {
        this.filter[item.prop].push(filterItem.value);
      } else {
        this.filter[item.prop].splice(findIndex, 1);
      }
      // console.log(this.filter)
      this.updateTableData();
    },
    handleClickForSort (item) {
      if (!item.prop) return false;
      if (this.sortProp !== item.prop) {
        this.sortProp = item.prop;
        this.sortType = 1;
      } else {
        this.sortType = this.sortType === 1 ? 0 : 1;
      }
      this.updateTableData();
    },
    updateTableData () {
      let tableData = this.dataset.slice(0);
      if (Object.keys(this.filter).length) {
        tableData = tableData.filter(d => {
          let res = true;
          for (const key in this.filter) {
            const { filterMethod } = this.columnsFilter[key];
            if (filterMethod) {
              res = filterMethod(this.filter[key], d, key);
            } else {
              this.filter[key].length && this.filter[key].indexOf(d[key]) === -1 && (res = false);
            }
            if (!res) {
              break;
            }
          }
          return res;
        });
      }

      if (this.sortProp) {
        tableData.sort((a, b) => {
          return (b[this.sortProp] - a[this.sortProp]) * (this.sortType === 1 ? 1 : -1);
        });
      }
      this.tableData = tableData;
    }
  }
};
</script>
<style lang="scss" scoped>
.cell {
  padding: 0 0.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 0.48rem;
  .z-dropdown-link {
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }
  .el-dropdown {
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }
  > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.list-header {
  display: flex;
  font-size: 0.32rem;
  color: #92B9F7;
  border-top: 2px solid #4E78A4;
  border-bottom: 2px dashed #92B9F7;
  .iconfont {
    font-size: 0.24rem;
    color: #92B9F7;
  }
}
.list-body__content {
  /deep/ {
    .vue-recycle-scroller__item-view {
      &:nth-child(even) {
        background-color: #0F2E6066;
      }
    }
  }
}
.list-body__row {
  display: flex;
  font-size: 0.28rem;
  color: #fff;
  border-bottom: 1px dashed #4E78A4;
  &:nth-child(even) {
    background-color: #0F2E6066;
  }
  &.canClick {
    cursor: pointer;
  }
  &.is-active {
    background: rgba(#1A50A7, 0.4);
  }
}
.list-header__item,
.list-body__column {
  // width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &.canClick {
    cursor: pointer;
  }
  &.active-cell{
    background: rgba(#1A50A7, 0.9);
  }
  &.is-width {
    flex-grow: 0 !important;
    flex-shrink: 0 !important;
  }
}
.list-header__item {
  height: 0.8rem;
}
.list-body__column {
  height: 0.64rem;
}
.noDataTip {
  margin: 0;
  font-size: 0.28rem;
  line-height: 0.64rem;
  text-align: center;
  color: #fff;
}
.formatter-process {
  position: relative;
  width: 80%;
  height: 20px;
  background-color: #898989;
  margin: 0 auto;
}
.formatter-process__value {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  transition: width 0.3 ease-in;
}
.isPointer {
  cursor: pointer;
}
.is-adaption {
  .m-list {
    height: 100%;
  }
  .list-body {
    height: calc(100% - 0.8rem)
  }
  .list-body__content {
    height: 100%;
  }
}
</style>
