<template>
  <div class="levelTitle" :class="`level${level}`">
    <component class="title" :is="`h${level}`">
      <i
        v-if="icon"
        class="iconfont icon"
        :class="[icon]"
      ></i>
      <slot><span>{{ txt }}</span></slot>
    </component>
    <div class="levelTitle__center">
      <slot name="center"></slot>
    </div>
    <div class="levelTitle__right">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "LevelTitle",
  props: {
    txt: {
      default: ""
    },
    icon: {
      default: ""
    },
    level: {
      default: "1"
    }
  }
};
</script>
<style lang="scss" scoped>
.levelTitle {
  width: 100%;
  color: #fff;
  white-space: nowrap;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    min-width: 3rem;
    display: inline-flex;
    align-items: center;
    margin-right: 0.2rem;
    .m-tabs {
      font-size: inherit;
    }
  }
  .icon {
    vertical-align: middle;
    margin-right: 0.1rem;
  }
  .icon-biaoti {
    margin-left: -0.1rem;
    margin-right: 0;
  }
  &.level1 {
    height: 0.7rem;
    border: 0;
    color: #FCBF51;
    line-height: 1;
    i {
      line-height: 0.7rem;
      color: #fff;
    }
    .title {
      .m-tabs {
        /deep/ {
          .m-tabs__item.is-active {
            color: #FCBF51;
            font-weight: bold;
          }
        }
      }
    }
    .levelTitle__center,
    .levelTitle__right {
      font-size: 0.36rem;
      .m-tabs {
        font-size: inherit;
      }
    }
  }
  &.level2 {
    height: 0.64rem;
    // padding: 0 0.24rem;
    color: #92B9F7;
    i {
      color: #1E5CBF;
    }
    .title {
      min-width: 2.2rem;
    }
    .levelTitle__center,
    .levelTitle__right {
      font-size: 0.32rem;
      .m-tabs {
        font-size: inherit;
      }
    }
  }
}
.levelTitle__center {
  flex: 1;
}
</style>
