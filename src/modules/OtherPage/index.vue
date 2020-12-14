<template>
  <div class="container">
      <el-carousel height="250px" arrow="always" :autoplay='false' indicator-position="none">
        <el-carousel-item v-for="(items,indexs) in urlsInner" :key="indexs" >
          <div class="tab-container">
            <div class="img-container" v-for="(item,index) in items" :key="index">
                <img :src="item.img" alt="" @click="imgClick(item)">
                <div class="img-label">{{item.name}}</div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
      <m-dialog :dialogVisible.sync="dialogVisible" :extraCss="dialogCSS">
        <iframe-container :iframeSrc="iframeSrc"></iframe-container>
      </m-dialog>
  </div>
</template>
<script>
import MDialog from "@/components/MDialog";
import IframeContainer from "@/components/IframeContainer";
import { getUrls } from "./api";
import {
  Carousel,
  CarouselItem
} from "element-ui";

export default {
  name: "OtherPage",
  components: {
    ElCarousel: Carousel,
    ElCarouselItem: CarouselItem,
    MDialog: MDialog,
    IframeContainer: IframeContainer
  },
  data () {
    return {
      dialogCSS: {
        width: "7680px",
        height: "2160px"
      },
      iframeSrc: "",
      dialogVisible: false,
      urls: []
      // urls: [
      //   {
      //       url: require("./img/test.png"),
      //       name: "历史保护建筑",
      //       src: "http://10.81.71.38/chengyun/chengyun-grid-v2/city.html?code=fhuvVWCejO4MII0diuvIBhRkRfUyWkkw"
      //   },
      //   {
      //       url: require("./img/test.png"),
      //       name: "上海火车站区域",
      //       src: "http://10.81.71.38/chengyun/chengyun-grid-v2/city.html?code=fhuvVWCejO4MII0diuvIBhRkRfUyWkkw"
      //   },
      //   {
      //       url: require("./img/test.png"),
      //       name: "静安区党建",
      //       src: "http://10.81.71.38/chengyun/chengyun-grid-v2/city.html?code=fhuvVWCejO4MII0diuvIBhRkRfUyWkkw"
      //   },
      //   {
      //       url: require("./img/test.png"),
      //       name: "营商环境",
      //       src: "http://10.81.71.38/chengyun/chengyun-grid-v2/city.html?code=fhuvVWCejO4MII0diuvIBhRkRfUyWkkw"
      //   },
      //   {
      //       url: require("./img/test.png"),
      //       name: "静安区管理平台",
      //       src: "http://10.81.71.38/chengyun/chengyun-grid-v2/city.html?code=fhuvVWCejO4MII0diuvIBhRkRfUyWkkw"
      //   },
      //   {
      //       url: require("./img/test.png"),
      //       name: "上海火车站区域",
      //       src: "http://10.81.71.38/chengyun/chengyun-grid-v2/city.html?code=fhuvVWCejO4MII0diuvIBhRkRfUyWkkw"
      //   }
      // ]

    };
  },
  props: {
    // initialIndex: {
    //   type: Number,
    //   default: 0
    // }
  },
  // watch: {
  //   dialogShow: {
  //     handler(nv, ov) {
  //       if (nv && !ov) {
  //         this.$nextTick(() => {
  //           this.initPosition();
  //         });
  //       }
  //     }
  //   }
  // },
  computed: {
    urlsInner() {
      let data = [];
      if (this.urls) {
        this.urls.forEach((url, index) => {
          let i = Math.floor(index / 4);
          url.img = window.$config.imageRootURL + url.img;
          if (data[i]) {
            data[i].push(url);
          } else {
            data[i] = [];
            data[i].push(url);
          }
        });
      }
       return data;
    }
  },
  methods: {
    imgClick(item) {
      this.dialogVisible = true;
      this.iframeSrc = item.url;
    }
  },
  created() {
      let urlString = window.location.href;
      let subIndex = urlString.lastIndexOf("html");
      let urlStringSub = urlString.substring(0, subIndex + 1);
      subIndex = urlStringSub.lastIndexOf("/");
      // 获取项目根路径
      this.rootUrl = urlStringSub.substring(0, subIndex + 1);
      getUrls().then(res => {
        if (res.list) {
          res.list.forEach(e => {
              let item = {
                img: e.image,
                name: e.name,
                url: e.url
              };
              this.urls.push(item);
          });
        }
      });
  },
  mounted () {

  }
};
</script>
<style lang="scss" scoped>
.container{
  border: 1px solid #174FA5;
  background: rgba(21, 79, 163, 0.4);
  width: 100%;
  height: 100%;

  /deep/ {
    .el-carousel__arrow{
      width: 0.8rem;
      height: 0.8rem;
      font-size: 0.7rem;
      color:#92B9F7;
      background-color:rgba(0, 184, 212,0.0);
    }
    // .el-carousel__button{
    //   height: 0.1rem;
    //   background-color:rgb(0, 184, 212);
    // }
  }
  .tab-container {
    margin :0.15rem 0.7rem 0rem 0.7rem;
     display: flex;
     flex-direction:row;
     justify-content:flex-start;
      width: 100%;
      height: 100%;
  }
}
  .img-container {
    margin :0rem 0.35rem 0rem 0.4rem;
    color:rgb(165, 165, 169);
    font-size: 0.34rem;

    img {
        user-select: none;
      cursor: pointer;
      display: block;
      width: 600px;
      height:168px;
    }
    .img-label {
      user-select: none;
      margin-top:0.1rem;
      text-align: center;
    }
  }
  .img-container:hover{
    color:#ffffff;
    font-weight:600;

  }

</style>
