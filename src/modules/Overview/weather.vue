<template>
  <div class="overview-item style1" >
    <div v-if="icon" class="overview-item__icon">
      <i class="iconfont icon-tianqi"></i>
    </div>
    <ul class="overview-item__content">
      <li class="overview-item__name">气象预警</li>
      <li class="overview-item__value" :style="{ color: vc }">
        <swiper ref="mySwiper" class="weather-swiper" v-if="images.length>0" :options="swiperOptions">
            <swiper-slide v-for="(image, index) in images" :key="index">
              <img :src="image" class="weather-alarm"/>
            </swiper-slide>
        </swiper>
        <div v-else>{{qxzs || '无'}}</div>
      </li>
      <slot></slot>
    </ul>
  </div>
</template>
<script>
import { getWeatherAlarm } from "./api";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  name: "WeatherItem",
  components: {
    swiper,
    swiperSlide
  },
  props: {
    icon: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: ""
    },
    value: {
      type: [String, Number],
      default: null
    },
    valueColor: {
      type: [String, Function],
      default: null
    },
    valueProp: {
      type: String,
      default: "value"
    },
    customClass: {
      type: String,
      default: "style1"
    },
    dataset: {
      type: Object,
      default: () => {
        return {};
      }
    },
    qxzs: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      images: [],
      swiperOptions: {
        slidesPerView: 2,
        spaceBetween: 0,
        mousewheel: true,
        loop: this.loop,
        autoHeight: this.autoHeight,
        speed: 500,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        }
      }
    };
  },
  inheritAttrs: false,
  computed: {
    vc() {
      return typeof this.valueColor === "function" ? this.valueColor(this.value) : this.valueColor;
    }
  },
  created() {
    this.$timer.register(this.getData, this);
  },
  methods: {
    getData() {
      getWeatherAlarm().then(res => {
        if (res.data) {
          let tmp = [];
          res.data.data.messages.map(item => {
            let type = item.args.WeatherPredictionWarning_category;
            let level = item.args.WeatherPredictionWarning_grade;
            let img = this.getWeatherImage(level, type);
            if (img) {
            tmp.push(
              require("@/assets/images/weather/" + img + ".png")
            );
            }
          });
          this.images = tmp;
        }
      });
    },
    getWeatherImage (level, type) {
      let color = null;
      let warn = null;
      switch (level) {
        case "蓝色":
          color = "1";
          break;
        case "黄色":
          color = "2";
          break;
        case "橙色":
          color = "3";
          break;
        case "红色":
          color = "4";
          break;
      }
      switch (type) {
        case "台风":
          warn = "1";
          break;
        case "暴雨":
          warn = "2";
          break;
        case "暴雪":
          warn = "3";
          break;
        case "寒潮":
          warn = "4";
          break;
        case "大风":
          warn = "5";
          break;
        case "高温":
          warn = "6";
          break;
        case "雷电":
          warn = "7";
          break;
        case "霜冻":
          warn = "8";
          break;
        case "大雾":
          warn = "9";
          break;
        case "道路结冰":
          warn = "10";
          break;
        case "冰雹":
          warn = "11";
          break;
        case "干旱":
          warn = "12";
          break;
        case "霾":
          warn = "13";
          break;
        case "沙尘暴":
          warn = "14";
          break;
        case "低温":
          warn = "15";
          break;
      }
      return warn ? warn + color : null;
    }
  }
};
</script>
<style lang="scss" scoped>
.overview-item {
  display: flex;
  align-items: center;
  color: #fff;
  line-height: 1.5;
  font-size: 0.24rem;
}
.overview-item__name {
  color: $titleLevel2;
}
.overview-item__icon {
  color: #0071FF;
  .supportWebkitTextFillColor &{
    background-image: linear-gradient(180deg, #4FCFD5 0%, #0071FF 100%);
    // background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.increase {
  display: flex;
}
sub {
  bottom: 0;
}

.style1,
.style2,
.style5 {
  .overview-item__icon {
    width: 1rem;
    font-size: 0.72rem;
    text-align: center;
    margin-right: 0.1rem;
  }
  .overview-item__name {
    font-size: 0.36rem;
  }
  .overview-item__value {
    font-size: 0.72rem;
    line-height: 0.96rem;
    font-weight: bold;
  }
}
.weather-alarm{
  width:150px;
  height: 130px;
}
.weather-swiper{
  width: 320px;
}
</style>
