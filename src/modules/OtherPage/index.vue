<template>
  <div class="container">
      <el-carousel height="250px" arrow="always" :autoplay='false' indicator-position="none">
        <el-carousel-item v-for="(items,indexs) in urlsInner" :key="indexs" >
          <div class="tab-container"  >
            <div class="img-container" v-for="(item,index) in items" :key="index"> 
                <img :src="item.url" alt="">
                <div class="img-label">{{item.name}}</div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
  </div>
</template>
<script>

import "element-ui/lib/theme-chalk/index.css";
import {
  Carousel,
  CarouselItem
} from 'element-ui'

export default {
  name: 'OtherPage',
  components: {
    ElCarousel: Carousel,
    ElCarouselItem: CarouselItem
  },
  data () {
    return {
      urls:[
        {
            url:require("./img/test.png"),
            name:"静安区管理平台"
        },
        {
            url:require("./img/test.png"),
            name:"静安区管理平台"
        },
        {
            url:require("./img/test.png"),
            name:"静安区管理平台"
        },
        {
            url:require("./img/test.png"),
            name:"静安区管理平台"
        },
        {
            url:require("./img/test.png"),
            name:"静安区管理平台"
        },
        {
            url:require("./img/test.png"),
            name:"静安区管理平台"
        }
      ]

    }
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
      let data = []
      if(this.urls) {
        let len = Math.ceil(this.urls.length / 4);
        this.urls.forEach((url, index) => {
          let i = Math.floor(index / 4);
          if(data[i]){
            data[i].push(url)
          } else {
            data[i] = []
            data[i].push(url)
          }        
        })
        console.log(data,"data-----------")
        return data;
      }

    }

  },
  methods: {
  },
  mounted () {
  }
}
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
    margin :0.2rem 0.7rem 0rem 0.7rem;
     display: flex;
     flex-direction:row;
     justify-content:flex-start;
      width: 100%;
      height: 100%;
  }
}
  .img-container {
    margin :0rem 0.35rem 0rem 0.4rem;
   
    img {
      display: block;
      width: 600px;
      height:168px;
    }
    .img-label {
      margin-top:0.1rem;
      text-align: center;
      color:#ffffff;
      font-size: 0.34rem;

    }
  }

</style>
