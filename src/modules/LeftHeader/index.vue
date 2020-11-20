<template>
  <div class="left-header">
    <div class="clock">
      <p class="clock-time">{{ now | formatterDate("hh : mm : ss") }}</p>
      <p class="clock-date">{{ now | formatterDate2 }}</p>
    </div>
    <weather :items="weatherItems" :dataset="weather"></weather>
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
        {
          icon: "iconfont icon-wendu",
          label: "温度",
          key: "temperature",
          unit: "°C"
        },
        {
          icon: "iconfont icon-shidu",
          label: "湿度",
          key: "humidity",
          unit: "%"
        },
        {
          icon: "iconfont icon-jiangyu",
          label: "降雨量",
          key: "precipitation",
          unit: "mm"
        },
        {
          icon: "iconfont icon-fengli",
          label: "风速",
          key: "windSpeed",
          unit: "m/s"
        },

        {
          icon: "iconfont icon-PM",
          label: "PM2.5",
          key: "pm25",
          unit: "μg/m³"
        },
        {
          icon: "iconfont icon-yangchen",
          label: "空气AQI",
          key: "aqi",
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
}
.clock {
  text-align: center;
  line-height: 0.6rem;
  flex-grow: 0;
  flex-shrink: 0;
}
.clock-time {
  font-size: 0.44rem;
}
.clock-date {
  font-size: 0.32rem;
}
.weather-wrap {
  width: 15rem;
  flex-grow: 0;
  flex-shrink: 0;
}
</style>
