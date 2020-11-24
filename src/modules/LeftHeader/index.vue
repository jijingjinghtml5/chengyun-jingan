<template>
  <div class="left-header">
    <div class="left-header__item clock">
      <p class="clock-time">{{ now | formatterDate("hh : mm : ss") }}</p>
      <p class="clock-date">{{ now | formatterDate2 }}</p>
    </div>
    <ul class="left-header__item condition">
      <li class="img">
        <img src="@/assets/images/weather/sun-rain.png" alt="">
      </li>
      <li>
        <p class="temp">{{ weather.temperature | initVal }}°C</p>
        <p class="report">晴转小雨</p>
      </li>
      <li class="img hasBorder">
        <img src="@/assets/images/weather/1-3.png" alt="">
      </li>
      <li class="img hasBorder">
        <img src="@/assets/images/weather/4-3.png" alt="">
      </li >
    </ul>
    <weather class="left-header__item" :items="weatherItems" :dataset="weather"></weather>
  </div>
</template>
<script>
import Weather from "./Weather";
import { formatterDate } from "@/utils/tools";
import { getWeatherData } from "./api";
const DayMapping = {
  0: "周日",
  1: "周一",
  2: "周二",
  3: "周三",
  4: "周四",
  5: "周五",
  6: "周六"
};
export default {
  name: "LeftHeader",
  components: { Weather },
  data() {
    return {
      now: new Date(),
      weatherItems: Object.freeze([
        // {
        //   icon: "iconfont icon-wendu",
        //   label: "温度",
        //   key: "temperature",
        //   unit: "°C"
        // },
        // {
        //   icon: "iconfont icon-yangchen",
        //   label: "空气AQI",
        //   key: "aqi",
        //   unit: ""
        // },
        // {
        //   icon: "iconfont icon-shidu",
        //   label: "湿度",
        //   key: "humidity",
        //   unit: "%"
        // },
        // {
        //   icon: "iconfont icon-jiangyu",
        //   label: "降雨量",
        //   key: "precipitation",
        //   unit: "mm"
        // },
        // {
        //   icon: "iconfont icon-fengli",
        //   label: "风速",
        //   key: "windSpeed",
        //   unit: "m/s"
        // },

        // {
        //   icon: "iconfont icon-PM",
        //   label: "PM2.5",
        //   key: "pm25",
        //   unit: "μg/m³"
        // }
        {
          icon: "iconfont icon-PM",
          label: "空气AQI",
          key: "aqi",
          unit: ""
        },
        {
          icon: "iconfont icon-yangchen",
          label: "扬尘指数",
          key: "aqi",
          unit: ""
        },
        {
          icon: "iconfont icon-jiangyu",
          label: "降雨量",
          key: "precipitation",
          unit: "mm"
        },
        {
          icon: "iconfont icon-fengli",
          label: "风力",
          key: "windSpeed",
          unit: ""
        },
        {
          icon: "iconfont icon-fengxiang",
          label: "风向",
          key: "windDirection",
          unit: ""
        }
      ]),
      weather: {}
    };
  },
  filters: {
    formatterDate2(val) {
      let day = new Date(val).getDay();
      return formatterDate(val, "yyyy/MM/dd") + " " + DayMapping[day];
    }
  },
  methods: {
    startClock() {
      let timer = setInterval(() => {
        this.now = new Date();
      }, 1000);
      this.$once("hook:beforeDestroy", () => {
        clearInterval(timer);
      });
    },
    async getWeatherDataValue() {
      const weatherDatas = await getWeatherData();
      let weatherData = weatherDatas.cityWeather;
      console.log(weatherDatas);
      if (weatherData && weatherData.length > 0) {
        this.weather = {
          temperature: weatherDatas.newData.temperature,
          humidity: weatherDatas.newData.humidity,
          precipitation: weatherDatas.newData.precipitation,
          windSpeed: weatherDatas.newData.windSpeed,
          pm25: weatherData[0].content.pm25,
          qpi: weatherData[0].content.aqi
        };
      }
    }
  },
  created() {
    this.startClock();
    this.$timer.register(this.getWeatherDataValue, this);
  }
};
</script>
<style lang="scss" scoped>
.left-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  border-bottom: 0.02rem solid #0F2E60;
  color: #92B9F7;
}
.left-header__item {
  margin-right: 0.2rem;
  &:last-child {
    margin-right: 0;
  }
}
.clock {
  min-width: 2.5rem;
  text-align: center;
  line-height: 0.6rem;
  flex-grow: 0;
  flex-shrink: 0;
  margin-right: 0.4rem;
}
.clock-time {
  font-size: 0.44rem;
}
.clock-date {
  font-size: 0.32rem;
}
.weather-wrap {
  width: 14rem;
  flex-grow: 0;
  flex-shrink: 0;
}
.condition {
  width: 0;
  flex: 1;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  text-align: center;
  line-height: 0.48rem;
  > li {
    margin-right: 0.1rem;
    flex-shrink: 0;
    &:last-child {
      margin-right: 0;
    }
  }
  .temp {
    font-size: 0.44rem;
  }
  .report {
    font-size: 0.32rem;
  }
  .img {
    height: 1.28rem;
    &.hasBorder {
      border: 0.02rem solid #2573EF;
      border-radius: 0.08rem;
      background-color: rgba(#2573EF, 0.4);
      overflow: hidden;
    }
    img {
      display: block;
      height: 100%;
    }
  }
}
</style>
