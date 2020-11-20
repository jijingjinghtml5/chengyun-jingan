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
      font-weight: inherit;
      /deep/ {
        .m-tabs__item.is-active {
          color: #fff;
        }
      }
    }
  }
  .icon {
    vertical-align: middle;
    color: #fff;
    margin-right: 0.1rem;
  }
  .icon-biaoti {
    margin-left: -0.1rem;
  }
  &.level1 {
    height: 0.72rem;
    border-bottom: 0.04rem solid #FCBF51;
    margin-bottom: 0.2rem;
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
    background-color: rgba(#00E5FF, 0.15);
    padding: 0 0.24rem;
    margin-bottom: 0.2rem;
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
