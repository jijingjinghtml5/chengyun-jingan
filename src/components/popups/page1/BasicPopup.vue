<template>
  <div  class="panel">
    <div class="category">{{key}}</div>
    <div class="name">{{detail["name"] || info.name}}</div>
    <div class="basic-info">
      <div class="item" v-for="(value, key) in detail" :key="key">
        <span>{{key}}: </span>
        <span style="color:#ffffff;">{{value === "Null" ? "": value}}</span>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "BasicPopup",
  inject: ["getGlobalConfig"],
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    detail() {
      if (!this.key) return {};
      let keys = Object.keys(this.info[this.key][0] || {}).filter(key => ["TARGET_FID", "Join_Count", "FID", "level", "坐标X", "坐标Y", "LEVEL_", "OBJECTID", "Shape", "geometrytype", "XQID"].indexOf(key) === -1);
      let data = {};
      for (let k in keys) {
        let value = this.info[this.key][0][keys[k]];
        if (value === "Null") continue;
        data[keys[k]] = value;
      }
      return data;
    },
    key() {
      return Object.keys(this.info).filter(key => key !== "giscamera" && key !== "责任网格" && key !== "roundCarLayer")[0];
    }
  },
  data() {
    return {

    };
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
  .basic-info{
    height: calc(100% - 150px);
    overflow: auto;
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
