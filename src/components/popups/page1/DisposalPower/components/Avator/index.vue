<template>
   <img v-if="imgUrl" :src="imgUrl" alt=""/>
</template>
<script>
// import { getTouxiang } from "../../api";
export default {
  name: "LazyImg",
  data() {
    return {
      rootUrl: window.$config.apiUrl,
      imgUrl: ""
    };
  },
  props: {
    uuid: {
      type: Array,
      default: null
    },
    prefix: {
      type: String,
      default: "data:image/jpeg;base64,"
    }
  },
  watch: {
    uuid: {
      handler() {
        this.getData();
      }
    }
  },
  methods: {
    getData() {
      if (!this.uuid || !this.uuid.length) return false;
      // let type = this.uuid[0].contentType;
      let uuid = this.uuid[0].uuid;
      this.imgUrl = `${this.rootUrl}/screen-api/v2/image?uuid=${uuid}`;
      // getTouxiang(uuid).then(res => {
      //   this.imgUrl = `data:${type};base64,${res}`;
      // });
    }
  },
  created() {
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
