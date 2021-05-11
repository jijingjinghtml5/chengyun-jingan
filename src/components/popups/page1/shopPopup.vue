<template>
  <div  class="panel">
    <div class="category">沿街商铺餐饮户</div>
    <div class="name">{{info["餐饮户名称（店铺名称）"]}}</div>
    <div class="basic-info">
      <div class="item">
        <span>街镇园区: </span>
        <span style="color:#ffffff;">{{info["街镇园区"]||""}}</span>
      </div>
      <div class="item">
        <span>统一社会信用代码: </span>
        <span style="color:#ffffff;">{{info["统一社会信用代码"]||""}}</span>
      </div>
      <div class="item">
        <img style="width:560px;316px;" :src="info['图片地址'] || require('@/assets/images/default.png')" />
      </div>
    </div>
    <div class="split-line"></div>
    <div class="paicha">
      <div class="item">
        <span>联系人：</span>
        <span  style="color:#ffffff;">{{info['联系人']}}</span>
      </div>
      <div class="item">
        <span>联系电话: </span>
        <span  style="color:rgb(235, 153, 6);">{{info['移动电话']}}</span>
      </div>
      <div class="item">
        <span>地址: </span>
        <span  style="color:#ffffff;">{{info['地址']}}</span>
      </div>
      <div class="item">
        <span>是否取得食品经营许可证: </span>
        <span  style="color:#ffffff;">{{info['是否取得食品经营许可证']}}</span>
      </div>
      <div class="item">
        <span>是否存在其它违规行为: </span>
        <span  style="color:#ffffff;">{{info['是否存在其它违规行为']}}</span>
      </div>
      <div class="item">
        <span>是否存在违法排放油烟: </span>
        <span  style="color:#ffffff;">{{info['是否存在违法排放油烟']}}</span>
      </div>
      <div class="item">
        <span>是否存在雨污混排: </span>
        <span  style="color:#ffffff;">{{info['是否存在雨污混排']}}</span>
      </div>
      <div class="item">
        <span>有无排水许可证: </span>
        <span  style="color:#ffffff;">{{info['有无排水许可证']}}</span>
      </div>
      <div class="item">
        <span>排水许可证编号: </span>
        <span  style="color:#ffffff;">{{info['排水许可证编号']}}</span>
      </div>
      <div class="item">
        <span>餐厨垃圾收运单位: </span>
        <span  style="color:#ffffff;">{{info['餐厨垃圾收运单位']}}</span>
      </div>
      <div class="item">
        <span>废弃油脂收运单位: </span>
        <span  style="color:#ffffff;">{{info['废弃油脂收运单位']}}</span>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "shopPopup",
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
    return {
      detail: {
        // committee_name: "四明居委"
        // coordinate_type: "高德"
        // district_name: "静安区"
        // grid: 6015
        // latitude: 31.222767126502884
        // longitude: 121.43600579234321
        // street_name: "静安寺街道"
        // 图片地址: ""
        // 地址: "静安寺街道镇宁路438号1层"
        // 备注: "农贸市场"
        // 废弃油脂收运单位: "-"
        // 排水许可证编号: "-"
        // 是否取得食品经营许可证: "是"
        // 是否存在其它违规行为: "-"
        // 是否存在违法排放油烟: "-"
        // 是否存在雨污混排: "-"
        // 是否存在雨污混接: "-"
        // 有无排水许可证: "-"
        // 移动电话: 18156958923
        // 统一社会信用代码: "92310106MA1KF18C04"
        // 编号: 1
        // 联系人: "郑南强"
        // 街镇园区: "静安寺街道"
        // 餐厨垃圾收运单位: "-"
        // 餐饮户名称（店铺名称）: "上海市静安区苏浩包子铺"
      }
    };
  },
  watch: {
    info: {
      handler(nv) {
      },
      deep: true
    }
  },
  methods: {
    getData() {
    }
  },
  mounted() {
    console.log("info", this.info);
  }
};
</script>
<style lang="scss" scoped>
.panel{
  width: 6.4rem;
  height: 17.6rem;
  padding: 0.4rem;

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
