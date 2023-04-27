<template>
  <div class="container">
    <div class="tabs">
      <p
        v-for="item in tabs"
        :class="{ active: currentTab === item.value }"
        :key="item.value"
        @click="changeTab(item)"
      >
        {{ item.name }}
      </p>
    </div>
    <el-carousel height="250px" arrow="always" :autoplay='false' indicator-position="none" :loop="false">
      <el-carousel-item v-for="(items,indexs) in urlsInner" :key="indexs">
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
  import {
    getUrls
  } from "./api";
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
    data() {
      return {
        currentTab: "",
        tabs: [
          { name: "市级", value: "city" },
          { name: "区级", value: "district" },
          { name: "街镇", value: "town" }
        ],
        dialogCSS: {
          width: "7680px",
          height: "2160px"
        },
        iframeSrc: "",
        dialogVisible: false,
        urls: []
      };
    },
    computed: {
      urlsInner() {
        let data = [];
        if (this.urls) {
          this.filterUrls.forEach((url, index) => {
            let i = Math.floor(index / 4);
            if (data[i]) {
              data[i].push(url);
            } else {
              data[i] = [];
              data[i].push(url);
            }
          });
        }
        return data;
      },
      filterUrls() {
        return this.currentTab ? this.urls.filter(item => this.isShow(item.id)) : this.urls;
      }
    },
    methods: {
      isShow(id) {
        if (this.currentTab === "city") {
          if (id >= 100 && id < 200) {
            return true;
          }
          return false;
        }
        if (this.currentTab === "district") {
          if (id >= 1 && id < 100) {
            return true;
          }
          return false;
        }
        if (this.currentTab === "town") {
          if (id >= 200) {
            return true;
          }
          return false;
        }
      },
      imgClick(item) {
        this.dialogVisible = true;
        this.iframeSrc = item.url;
      },
      changeTab(item) {
        if (this.currentTab === item.value) {
          this.currentTab = "";
          return;
        }
        this.currentTab = item.value;
      }
    },
    created() {
      this.$bus.$on('showShopFestival', () => {
        this.dialogVisible = true;
        this.iframeSrc = 'http://10.210.232.238/chengyun/custom/jingan-shop-festival/index.html';
      })
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
              img: window.$config.imageRootURL + e.image,
              name: e.name,
              url: e.url,
              id: e.id
            };
            this.urls.push(item);
          });
        }
      });
    }
  };
</script>
<style lang="scss" scoped>
  .container {
    border: 1px solid #174FA5;
    background: rgba(21, 79, 163, 0.4);
    width: 100%;
    height: 100%;
    position: relative;
    padding-left: 1.5rem;

    .tabs {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      left: 0;
      top: 0;
      padding: 0.2rem;
      height: 100%;
      p {
        font-size: 0.42rem;
        cursor: pointer;
        color: #92B9F7;
        &.active {
          color: #FFFFFF;
        }
      }
    }

    /deep/ {
      .el-carousel__arrow {
        width: 0.8rem;
        height: 0.8rem;
        font-size: 0.7rem;
        color: #92B9F7;
        background-color: rgba(0, 184, 212, 0.0);
      }
    }

    .tab-container {
      margin: 0.15rem 0.7rem 0rem 0.7rem;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      width: 100%;
      height: 100%;
    }
  }

  .img-container {
    margin: 0rem 0.35rem 0rem 0.4rem;
    color: rgb(165, 165, 169);
    font-size: 0.34rem;

    img {
      user-select: none;
      cursor: pointer;
      display: block;
      width: 560px;
      height: 168px;
    }

    .img-label {
      user-select: none;
      margin-top: 0.1rem;
      text-align: center;
    }
  }

  .img-container:hover {
    color: #ffffff;
    font-weight: 600;

  }
</style>
