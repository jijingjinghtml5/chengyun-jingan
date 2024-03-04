<template>
    <div class="panel">
      <div class="category">{{ info.name }}</div>
      <div class="tab-content">
        <div v-for="(item, i) in info.list" :key="i" class="tab-item" @click="handleClick(item, i)">
          <p class="index">{{ i + 1 }}</p>
          <div class="tab-info">
            <p :class="[
                'info-content',
                { 'info-content__collapse': item.collapse }
              ]">
              <span>{{ item.ajlx }} </span>
              <span @click="toCaeDetail(item)">查看详情 >></span>
            </p>
            <p>
              <span class="info-time">{{ item.lasj }}</span>
              <span class="info-address" :title="item.afdz">{{ item.afdz }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  import MIframe from "@/components/MIframe";
  import { getParams } from "@/utils/";
  import config from '@/config/index'
  
    export default {
      name: "HuoqingEventPopup",
      components: {
        MIframe
      },
      props: {
        info: {
          type: Object,
          default: () => {
            return {
              name: "",
              list: []
            };
          }
        }
      },
      data() {
        return {
          code: getParams()["code"],
          apiurl: config.apiUrlForRj,
          disposeUrl: config.disposeUrl,
          currentIndex: ""
        };
      },
      methods: {
        handleClick(item, i) {
          if (this.currentIndex === i) {
            this.$_mapProxy.clearPosition();
            this.$_mapProxy.fullExtent();
            this.currentIndex = "";
            return;
          }
          this.currentIndex = i;
          this.$_mapProxy.goToPosition(item.cjX, item.cjY);
        },
        toCaeDetail(data) {
          this.$bus.$emit('openHuoqingCaseDetailPopup', data)
        }
      }
    };
  </script>
  <style lang="scss" scoped>
    .panel {
      width: 12rem;
      height: 15.6rem;
      padding: 0.4rem;
      border: 1px solid #4E78A4;
  
      font-size: 16*2px;
      color: rgba(146, 185, 247, 1);
  
      .category {
        width: 100%;
        font-size: 22*2px;
        font-family: MicrosoftYaHei;
        color: rgba(146, 185, 247, 1);
      }
  
      .tab-content {
        width: 100%;
        height: calc(100% - 100px);
        font-size: 0.28rem;
        overflow: auto;
        position: relative;
  
        .tab-item {
          display: flex;
          background: linear-gradient(
            180deg,
            rgba(84, 88, 169, 0.2) 0%,
            rgba(21, 79, 163, 0.4) 100%
          );
          border: 1px solid #0e3884;
          justify-content: flex-start;
          margin-bottom: 0.2rem;
          align-items: center;
          padding: 0.1rem;
          cursor: pointer;
          &:last-child {
            margin-bottom: 0;
          }
  
          img {
            width: 1rem;
          }
          .index {
            width: 0.8rem;
            text-align: center;
            font-size: 0.54rem;
            font-weight: 500;
            color: #00e2ff;
          }
          .tab-info {
            margin-left: 0.3rem;
            p {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
          }
          .info-content {
            color: #ffffff;
            width: 10rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
            line-height: 0.5rem;
            user-select: none;
            &__collapse {
              text-overflow: unset;
              white-space: unset;
            }
            &__button {
              color: #367fbd;
              float: right;
            }
          }
          .info-time {
            color: #71a8e4;
            line-height: 0.45rem;
          }
          .info-address {
            width: 5rem;
            color: #FFFFFF;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: right;
          }
        }
      }
    }
  </style>
  