<template>
  <div class="container">
    <div class="opt-btns-wp">
      <div
        class="select-wp"
        @mouseenter="handleMouseForToggleActionsPanel(true)"
        @mouseleave="handleMouseForToggleActionsPanel(false)">
        <el-select
          v-if="videoStatus === 'normal'"
          class="videoTypeSelect"
          v-model="currentMode"
          placeholder="视频巡逻"
          popper-class="videoManager-select-dropdown"
          @change="handleSelectForChangeMode"
          @visible-change="handleChangeForSelectPanel">
          <el-option
            v-for="item in selections"
            :label="item.label"
            :key="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div
          v-else-if="videoStatus === 'area'"
          class="peripheral-video">
          <span>{{ areaLoading ? "加载中..." : ("周边视频（" + currentVideos.length.toLocaleString() + "）") }}</span>
          <span class="close-btn" @click="handleClickForClosePeripheralVideo" >x</span>
        </div>
        <el-button-group class="actions-panel" v-show="actionsPanelVisible">
          <el-button type="primary" icon="el-icon-caret-left" @click="handleClickForPrev"></el-button>
          <el-button type="primary" :icon="playIcon" @click="handleClickForToggleAutoSwitch(undefined)"></el-button>
          <el-button type="primary" icon="el-icon-caret-right" @click="handleClickForNext"></el-button>
          <el-button  class="text-btn" type="primary" >{{ currentPlayOption.currentPage +'/'+ currentPlayOption.totalPage }}</el-button>
        </el-button-group>
      </div>
      <div class="radio-control">
        <span>分布</span>
        <span class="radio" @click="handleClickForToggleVideoLayer(undefined)" >
          <span :class="toggleClass" class="circle"></span>
        </span>
        <span :class="{active: videoLayerStatus === true}" class="status-text" >{{ statusText }}</span>
      </div>
    </div>
    <div class="container-wrap">
      <video-mode
      :config="currentLayoutConfig"
      :videos="pageVideos"
    ></video-mode>
    </div>
  </div>
</template>
<script>
import videoMode from "./components/videoMode";
import VideoMixins from "./mixins/base";
export default {
  name: "videos",
  components: {
    videoMode
  },
  mixins: [VideoMixins],
  inheritAttrs: false
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  border: 0.02rem solid #4e78a4;
}
.opt-btns-wp {
  // position: absolute;
  // top: 0.2rem;
  // left: 0.2rem;
  display: flex;
  align-items: center;
  z-index: 1;
  /deep/ {
    .el-select {
      vertical-align: top;
    }

    .el-input {
      font-size: 0.28rem !important;
    }

    .el-input__inner {
      background-color: rgba(22, 80, 164, 0.6) !important;
      color: #fff !important;
      padding: 0 0.2rem !important;
      height: 0.78rem !important;
      line-height: 0.78rem !important;
      border: 0.02rem solid #1650a4 !important;
      // width: 3.80rem !important;
    }

    .el-select .el-input .el-select__caret {
      color: #fff;
      font-size: 0.28rem !important;
    }

    .el-input__icon {
      width: 0.5rem !important;
      line-height: 0.78rem !important;
    }

    .el-button {
      padding: 0.12rem 0.20rem !important;
      font-size: 0.48rem !important;
      line-height: 0.48rem;
      /* border-radius: 0.08rem !important; */
    }

    .el-button.text-btn {
      font-size: 0.36rem !important;
      height: 0.8rem;
    }

    .el-button.text-btn span {
      display: inline-block;
      line-height: 0.48rem;
    }

    .el-button-group {
      display: inline-block;
      vertical-align: top;
    }

    .el-button--primary {
      background-color: rgba(22,80,164, 0.6) !important;
      border: 0.02rem solid #1650a4 !important;
    }
  }
}
.select-wp {
  font-size: 0;
  width: 3.6rem;
  .videoTypeSelect{
    width: 3.6rem;
  }
}
.container-wrap{
  height: calc(100% - 80px);
}
.actions-panel {
  position: absolute;
  top: 0.788rem;
  left: 0rem;
  z-index:999
}
.peripheral-video {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 3.8rem;
  border-radius: 0.05rem;
  padding: 0.2rem;
  color: #fff;
  font-size: 0.28rem;
  background-color: rgba(22,80,164, 0.7);
  border: 0.02rem solid #1650a4;
  .close-btn {
    color: #669DF4;
    cursor: pointer;
  }
}

.radio-control {
  display: flex;
  align-items: center;
  font-size: 0.28rem;
  color: #7babf5;
  cursor: pointer;
  background-color: rgba(22,80,164, 0.7);
  border: 0.02rem solid #1650a4;
  border-radius: 0.05rem;
  height: 0.78rem;
  width: 2.4rem;
  justify-content: center;
  // margin-left: 0.1rem;
  span {
    text-shadow: 0.02rem 0.02rem #0a0a0a;
    font-weight: bold;
  }

  .radio {
    display: flex;
    align-items: center;
    width: 0.8rem;
    height: 0.32rem;
    margin: 0 0.1rem;
    border-radius: 0.2rem;
    border: 0.01rem solid #fff;
    background: rgba(37, 115, 239, 0.4);

    .circle {
      display: inline-block;
      width: 0.24rem;
      height: 0.24rem;
      margin-left: 0.04rem;
      border-radius: 50%;
      background: #fff;
      transition: all 0.3s;

      &.close {
        transform: translate3d(0.45rem, 0, 0);
      }
    }
  }

  .status-text {
    color: #aaa;

    &.active {
      color: #6ccb73;
    }
  }
}
</style>
<style lang="scss">
.videoManager-select-dropdown {
  &.el-select-dropdown {
    border: 0.01rem solid #1650a4 !important;
    background-color: rgba(22,80,164, 0.6) !important;
    color: #fff !important;
  }

  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color: #1650a4 !important;
  }

  .el-select-dropdown__item {
    color: #fff !important;
    font-size: 0.28rem !important;
    height: 0.64rem !important;
    line-height: 0.64rem !important;
    padding: 0 0.4rem !important;
  }

  .el-select-dropdown__item.selected {
    color: #409EFF !important;
    font-weight: 700;
  }

  .el-popper[x-placement^=bottom] .popper__arrow {
    top: -0.12rem !important;
    margin-right: 0.06rem !important;
  }
}
</style>
