<template>
  <div class="videoContainer">
      <div class="video-title">
        智能巡查{{videoNumber}}
      </div>
      <div>
          <div class="video-item" v-for="(item,index) in videoData" :key="index">
            <qv-player :videoSrc="item.src"></qv-player>
          </div>
      </div>
  </div>
</template>
<script>
import qvPlayer from "@/components/Video/qvPlayer";
export default {
  components: { qvPlayer },
  name: "video",
  data() {
    return {
      videoNumber: "（1/147）",
      videoData: [
        { src: "" },
        { src: "" },
        { src: "" },
        { src: "" },
        { src: "" }
      ]

    };
  },
  computed: {
    // btnActives() {
    //   let data = [];
    //   this.mapToolsData.forEach(e => {
    //     data.push(false);
    //   });
    //   return data;
    // }
  },
  watch: {
     btnActives: {
       handler(val) {
          // console.log(val, "cL");
       },
       deep: true

     }
  },
  methods: {

  },
  mounted() {

  }
};
</script>
<style lang="scss" scoped>
.videoContainer{
   position:absolute;
   width: 600px;
   height: 1550px;
   right: 0.1rem;
   bottom: 0.1rem;
   background:rgba(84, 88, 169, 0.2);
   border: 1px solid #0F2E60;
   padding:0.1rem;
}
.video-item{
  margin: 0.18rem 0rem;
  width: 100%;
  height: 2.8rem;
}
.video-title{
  font-size: 0.32rem;
}

</style>
