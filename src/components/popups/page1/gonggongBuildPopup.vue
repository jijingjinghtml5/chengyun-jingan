<template>
    <div  class="panel">
      <div class="category">{{type}}</div>
      <div class="name"></div>
      <div class="basic-info" v-if="type === '学校'">
        <div class="item">
          <span>名称: </span>
          <span style="color:#ffffff;">{{detail["名称"]||""}}</span>
        </div>
        <div class="item">
          <span>类别: </span>
          <span style="color:#ffffff;">{{detail["类别"]||""}}</span>
        </div>
        <div class="item">
          <span>所属区县: </span>
          <span style="color:#ffffff;">{{detail["所属区县"]||""}}</span>
        </div>
        <div class="item">
          <span>地址: </span>
          <span style="color:#ffffff;">{{detail["地址"]||""}}</span>
        </div>
        <div class="item">
          <span>办学性质: </span>
          <span style="color:#ffffff;">{{detail["办学性质"]||""}}</span>
        </div>
      </div>
      <div class="basic-info" v-if="type === '养老院'">
        <div class="item">
          <span>街道名称: </span>
          <span style="color:#ffffff;">{{detail["街道名称"]||""}}</span>
        </div>
        <div class="item">
          <span>地址: </span>
          <span style="color:#ffffff;">{{detail["地址"]||""}}</span>
        </div>
        <div class="item">
          <span>养老院机构名称: </span>
          <span style="color:#ffffff;">{{detail["养老机构名称"]||""}}</span>
        </div>
      </div>
      <div class="basic-info" v-if="type === '医院'">
        <div class="item">
          <span>名称: </span>
          <span style="color:#ffffff;">{{detail["名称"]||""}}</span>
        </div>
        <div class="item">
          <span>所属区县: </span>
          <span style="color:#ffffff;">{{detail["所属区县"]||""}}</span>
        </div>
        <div class="item">
          <span>街道名称: </span>
          <span style="color:#ffffff;">{{detail["街道名称"]||""}}</span>
        </div>
        <div class="item">
          <span>地址: </span>
          <span style="color:#ffffff;">{{detail["地址"]||""}}</span>
        </div>
        <div class="item">
          <span>等级分类: </span>
          <span style="color:#ffffff;">{{detail["等级分类"]||""}}</span>
        </div>
      </div>
    </div>
  </template>
  <script>
  // import juwei_detail from "../data/xiaoqu_detail"
  
  export default {
    name: "gonggongBuildPopup",
    inject: ["getGlobalConfig"],
    props: {
      info: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    data() {
      return {};
    },
    computed: {
        detail() {
            return (this.info.args && this.info.args.attributes) || {}
        },
        type() {
            if (this.info.messageType === '医院1') {
                return '医院'
            }
            return this.info.messageType || ''
        }
    }
  };
  </script>
  <style lang="scss" scoped>
  .panel{
    width: 6.4rem;
    height: 15.6rem;
    padding: 0.4rem;
     border: 1px solid #4E78A4;
  
    font-size: 16*2px;
    color:rgba(146, 185, 247, 1);
    .item{
      padding: 10px 0;
    }
    .split-line{
      width: 100%;
      height: 2px;
      border-bottom: 2px solid rgba(78,120,164,1);
      margin: 20px 0;
    }
    .category{
      width: 100%;
      font-size:22*2px;
      font-family:MicrosoftYaHei;
      color:rgba(146,185,247,1);
    }
    .name{
      font-size: 26*2px;
      font-family:MicrosoftYaHei;
      color: #ffffff;
      padding: 20px 0;
    }
  }
  </style>
  