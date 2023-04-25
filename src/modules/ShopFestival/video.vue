<template>
  <div id="CustomVideo">
    <div class="page-wrap">
      <el-pagination
        background
        layout="pager"
        :page-size="2"
        :current-page.sync="currentPage"
        :total="videoPoints.length">
      </el-pagination>
    </div>
    <template v-if="videos.length">
      <div class="video-item" v-for="item in showVideos" :key="item.cameraId">
        <qvPlayer :videoSrc="item"></qvPlayer>
      </div>
    </template>
  </div>
</template>

<script>
import qvPlayer from "@/components/Video/qvPlayer";
import { getVideoRealUrl } from './api.js'
export default {
  name: 'CustomVideo',
  components: {
    qvPlayer
  },
  data() {
    return {
      currentPage: 1,
      videoPoints: [
        { name: '兴业太古汇', code: '31010612001181056001', street: '0612' },
        { name: '兴业太古汇', code: '31010612001181055015', street: '0612' },
        { name: '兴业太古汇', code: '31010612001181078009', street: '0612' },
        { name: '兴业太古汇', code: '31010612001181078002', street: '0612' },
        { name: '久光百货', code: '31010611001181056007', street: '0613' },
        { name: '久光百货', code: '31010611001181056008', street: '0613' },
        { name: '久光百货', code: '31010611001181028011', street: '0613' },
        { name: '久光百货', code: '31010611001181028006', street: '0613' },
        { name: '梅龙镇广场', code: '31010612001181051011', street: '0612' },
        { name: '梅龙镇广场', code: '31010612001181051012', street: '0612' },
        { name: '上海恒隆广场', code: '31010612001181050004', street: '0612' },
        { name: '上海恒隆广场', code: '31010612001181050002', street: '0612' },
        { name: '中信泰富广场', code: '31010612001181065009', street: '0612' },
        { name: '中信泰富广场', code: '31010612001181050003', street: '0612' },
        { name: '中信泰富广场', code: '31010612001181067003', street: '0612' },
        { name: '中信泰富广场', code: '31010612001181065010', street: '0612' },
        { name: '静安大悦城', code: '31010623001181013002', street: '0602' },
        { name: '静安大悦城', code: '31010623001181004009', street: '0602' },
        { name: '静安大悦城', code: '31010623001181004005', street: '0602' },
        { name: '静安大悦城', code: '31010623001181004003', street: '0602' },
        { name: '久光中心', code: '31010616001180002036', street: '0604' },
        { name: '久光中心', code: '31010616001180003031', street: '0604' },
        { name: '久光中心', code: '31010616001180001005', street: '0604' },
        { name: '久光中心', code: '31010616001181010009', street: '0604' },
        { name: '静安大融城', code: '31010617001180002011', street: '0617' },
        { name: '静安大融城', code: '31010617001181017053', street: '0617' },
        { name: '芮欧百货', code: '31010611001181067013', street: '0613' },
        { name: '芮欧百货', code: '31010611001181028014', street: '0613' },
        { name: '晶品购物商场', code: '31010611001181054014', street: '0613' },
        { name: '晶品购物商场', code: '31010611001181054011', street: '0613' },
        { name: '静安嘉里中心', code: '31010611001181028015', street: '0613' },
        { name: '静安嘉里中心', code: '31010611001181028014', street: '0613' },
      ],
      videos: []
    }
  },
  computed: {
    showVideos() {
      return this.videos.slice((this.currentPage - 1) * 2, this.currentPage * 2)
    }
  },
  created() {
    const nvParams = this.videoPoints.map(d => {
      return {
        districtCode: '06',
        streamType: "HLS",
        cameraId: d.code,
        streetCode: d.street,
      };
    });
    getVideoRealUrl(nvParams).then(res => {
      if (res.resultData) {
        this.videos = nvParams.map((item, index) => {
          let video = res.resultData.data.cameraInfos[index] || {};
          return {
            ...item,
            ...video,
            code: item.cameraId,
            url: video.videoPath ? video.videoPath : item.url
          };
        });
        console.log(this.videos, 'videos')
      }
    }).catch(err => {
      console.log("video >>>> trans error", err);
    });
  }
}
</script>

<style lang="scss">
#CustomVideo {
  .el-pager li {
    font-size: 0.3rem;
    height: 0.4rem;
    line-height: 0.4rem;
    padding: 0 0.2rem;
  }
  .el-pagination button {
    font-size: 0.3rem;
    height: 0.4rem;
    line-height: 0.4rem;
    padding: 0 0.2rem;
  }
}
</style>
<style lang="scss" scoped>
#CustomVideo {
  height: 5rem;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .page-wrap {
    position: absolute;
    right: 0.2rem;
    top: 0.2rem;
  }
  .video-item {
    flex: 1;
    height: 5rem;
    & + .video-item {
      margin-left: 0.2rem;
    }
  }
}
</style>
