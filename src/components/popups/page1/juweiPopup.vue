<template>
  <div  class="panel">
    <div class="category">居委</div>
    <div class="name"></div>
    <div class="basic-info">
      <div class="item">
        <span>供应商: </span>
        <span style="color:#ffffff;">{{info["vendor"]||""}}</span>
      </div>
      <div class="item">
        <span>地址: </span>
        <span style="color:#ffffff;">{{info["address"]||"" }}</span>
      </div>
      <div class="item">
        <span>类型: </span>
        <span style="color:#ffffff;">{{info["PTscene"]||""}}</span>
      </div>
      <!-- <div class="item">
        <img style="width:560px;316px;" :src="detail['image'] || require('@/assets/images/default.png')" />
      </div> -->
    </div>

  </div>
</template>
<script>
// import juwei_detail from "../data/xiaoqu_detail"

export default {
  name: "gridPopup",
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
          // "id": 1, //id
          // "name": "香山公寓", //名称
          // "address": "愚园路168号", //位置
          // "building_number": 147, //楼栋数
          // "management_company": "上海宏仑管理有限公司", //物业公司
          // "contact_person": "张三", //物业联系人
          // "contact_number": "13621678765", //物业联系方式
          // "paimo_condition": { //排摸情况
          //     "entrance_number": 1,  //出入口数
          //     "from_zhongdian_today": 1,//今日重点地区来沪人数
          //     "from_zhongdian_total": 2,//重点地区来沪人员总数
          //     "from_guanzhu_today": 1, //今日重点关注地区来沪人数
          //     "from_guanzhu_total": 2,//重点关注地区来沪人员总数
          //     "from_other_today": 1,//今日其它地区来沪人数
          //     "from_other_total": 2 //其它地区来沪人员总数
          // },
          // "all_building": [
          //     {
          //         "building_no": "1号楼", //楼号
          //         "disinfection_situation": "xxx", //消毒情况
          //         "tenants_number": 2, //出租户
          //         "residents_number": 20, //居民数
          //         "from_zhongdian_total": 2,//重点地区来沪人员总数
          //         "from_guanzhu_total": 2,//重点关注地区来沪人员总数
          //         "from_other_total": 2 //其它地区来沪人员总数
          //     }
          // ]
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
    this.getData();
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
