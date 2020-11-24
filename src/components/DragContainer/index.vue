<template>
  <transition name="fade">
    <div class="drag-container" :id="id" :ref="id" v-show="dialogShow" >
      <div class="drag-close" @click="handleClose">
        <i class="iconfont icon-arrow_right"></i>
        <i class="iconfont icon-arrow_left"></i>
      </div>
      <div class="drag-content" v-if="urls && dialogShow">
        <template v-if="type==='img'">
          <el-carousel height="18rem" indicator-position="outside" :initial-index="initialIndex">
            <el-carousel-item v-for="(item,index) in urls" :key="index">
              <div class="img-container">
                <img :src="item.url" alt="">
                <div class="img-cover"></div>
              </div>
            </el-carousel-item>
         </el-carousel>
        </template>
        <template v-else-if="type==='video'">
        <el-carousel height="18rem" indicator-position="outside" :initial-index="initialIndex">
          <el-carousel-item v-for="(item,index) in urls" :key="index">
            <video :src="item.url" autoplay controls></video>
          </el-carousel-item>
         </el-carousel>
        </template>
      </div>
    </div>
  </transition>
</template>
<script>
import drag from "@/directives/drag";
import {
  Carousel,
  CarouselItem
} from "element-ui";
let uuid = 1;
let zIndex = 1000;
export default {
  name: "DragVideo",
  components: {
    ElCarousel: Carousel,
    ElCarouselItem: CarouselItem
  },
  data () {
    return {
      id: `drag-container-${uuid++}`,
      zIndex: zIndex++,
      dom: null
    };
  },
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ""
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    urls: {
      type: Array,
      default: () => {
        return [];
      }
    },
    isDrag: {
      type: Boolean,
      default: true
    },
    appendDom: {
      type: String,
      default: ""
    },
    isAppendDom: {
      type: Boolean,
      default: true
    }
  },
  directives: {
    drag
  },
  methods: {
    handleClose () {
      this.$emit("update:dialogShow", false);
      this.$emit("close");
    },
    handleMouseDown (e) {
      console.log("mouseDown", e);
    },
    handleMouseUp (e) {
      console.log("mouseUp", e);
    },
    initPosition () {
      const parentNode = document.documentElement;
      // let dom = document.querySelector(`#${this.id}`);
      const dom = this.$refs[this.id];
      const parentWidth = parentNode.clientWidth;
      const parentHeight = parentNode.clientHeight;
      const selfWidth = dom.offsetWidth;
      const selfHeight = dom.offsetHeight;
      dom.style.left = ((parentWidth - selfWidth) / 2 - 100) + "px";
      dom.style.top = ((parentHeight - selfHeight) / 2 + 300) + "px";
    },
    appendToBody () {
      if (!this.isAppendDom) return false;
      if (this.$refs[this.id]) {
        let parentNode = this.appendDom ? document.querySelector(this.appendDom) : document.body;
        parentNode.appendChild(this.$refs[this.id]);
        parentNode = null;
        this.$once("hook:beforeDestroy", () => {
          let parent = this.$refs[this.id].parentNode;
          if (parent) {
            parent.removeChild(this.$refs[this.id]);
          }
          parent = null;
        });
      }
    }
  },
  mounted () {
    this.appendToBody();
  }
};
</script>
<style lang="scss" scoped>
.drag-container{
  position: absolute;
  z-index: 100000;
  background-color: rgba(2, 16, 35, 0.6);
  border: 0.02rem solid #448AFF;
  padding: 1rem 0rem 0rem 0rem;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  /deep/ {
    .el-carousel__arrow{
      width: 0.8rem;
      height: 0.8rem;
      font-size: 0.7rem;
      background-color:rgba(0, 184, 212,0.6);
    }
    .el-carousel__button{
      height: 0.1rem;
      background-color:rgb(0, 184, 212);
    }
  }
}
.drag-close {
  position: absolute;
  top: 0.2rem;
  right: 0.05rem;
  font-size: 0.45rem;
  color: #7DD4FB;
  cursor: pointer;
  .icon-arrow_right {
    margin-right: -0.23rem;
  }
}
.drag-content {
  border: 0.02rem solid rgba(2, 16, 35, 1);
  width: 100%;
  height: 100%;
  background-color: rgba(2, 16, 35, 0.6);
  overflow: hidden;
  .img-container {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .img-cover {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
  }
  img, video {
    width: 100%;
    height: 100%;
  }
  img {
    object-fit: contain;
  }
  video {
    object-fit: cover;
    overflow: hidden;
  }
}
</style>
