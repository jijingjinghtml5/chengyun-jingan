<template>
  <div  class="panel">
    <div class="category">多用途单体建筑</div>
    <div class="name">{{info["building_name"]}}</div>
    <div class="basic-info">
      <div class="item">
        <span>所属街道: </span>
        <span style="color:#ffffff;">{{info["street"]||""}}</span>
      </div>
      <div class="item">
        <span>所属居民区: </span>
        <span style="color:#ffffff;">{{info["committee"]||""}}</span>
      </div>
      <div class="item">
        <span>地址: </span>
        <span style="color:#ffffff;">{{info["address"]||""}}</span>
      </div>
      <div class="item">
        <span>建筑类型: </span>
        <span style="color:#ffffff;">{{info["type"]||""}}</span>
      </div>
      <div class="item">
        <span>所属部门: </span>
        <span style="color:#ffffff;">{{info["sys_org_code"]||""}}</span>
      </div>
      <!-- <div class="item">
        <img style="width:560px;316px;" :src="info['图片地址'] || require('@/assets/images/default.png')" />
      </div> -->
    </div>
    <div class="split-line"></div>
    <div class="paicha">
      <!-- <div class="item">
        <span>物业名称: </span>
        <span  style="color:#ffffff;">{{info['物业名称'] }}</span>
      </div> -->
      <div class="item">
        <span>联系人：</span>
        <span  style="color:#ffffff;">{{formatName(info['name'])}}</span>
      </div>
      <div class="item">
        <span>联系电话: </span>
        <span  style="color:rgb(235, 153, 6);">{{formatPhone(info['photo'])}}</span>
      </div>
      <div class="item">
        <span>建筑用途说明: </span>
        <span  style="color:rgb(235, 153, 6);">{{info['illustrate']}}</span>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "singleBuilding",
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
          // "name": "雷克萨斯战地医院", //名称
          // "address": "愚园路168号", //位置
          // "contact_person": "张三", //工地联系人
          // "contact_number": "13621678765", //工地联系方式
          // "paimo_condition": { //排摸情况
          //     "state": "xxx",  //营业状态
          //     "staff_number": 1,  //用工人数
          //     "from_zhongdian_today": 1,//今日重点地区来沪人数
          //     "from_zhongdian_total": 2,//重点地区来沪人员总数
          //     "from_guanzhu_today": 1, //今日重点关注地区来沪人数
          //     "from_guanzhu_total": 2,//重点关注地区来沪人员总数
          //     "from_other_today": 1,//今日其它地区来沪人数
          //     "from_other_total": 2 //其它地区来沪人员总数
          // },
          // "staff_situation": [
          //     {
          //         "name": "赵某某", //姓名
          //         "leave_place": "淮北", //出发地
          //         "contact_number": "15888811346", //联系方式
          //         "address_hu": "徐汇区小木桥路680号9号楼202室", //在沪住址
          //         "time_to_hu": "2020.2.7", //抵沪时间
          //         "yiguan_remaining_days": "9天" //医观剩余时间
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
    formatName(name) {
      let sName = '-'
      if (name) {
        sName = name.substring(0, 1) + '*' + name.substring(2)
      }
      return sName
    },
    formatPhone(phone) {
      let sphone = '-'
      if (phone) {
        sphone = phone.substring(0, 4) + '****' + phone.substring(8)
      }
      return sphone
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
