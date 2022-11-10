<template>
  <div class="left-header">
    <div class="left-header__item clock">
      <p class="clock-time">{{ now | formatterDate("hh : mm : ss") }}</p>
      <p class="clock-date">{{ now | formatterDate2 }}</p>
    </div>
    <ul class="left-header__item condition">
      <li>
        <p class="temp">{{ weather.temperature | initVal }}°C</p>
        <p class="report"></p>
      </li>
    </ul>
    <weather class="left-header__item" :items="weatherItems" :dataset="weather"></weather>
  </div>
</template>
<script>
import Weather from "./Weather";
import { formatterDate } from "@/utils/tools";
import { getWeatherData, getAQI } from "./api";
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
          label: "AQI",
          key: "aqi",
          unit: ""
        }
        // {
        //   icon: "iconfont icon-shidu1",
        //   label: "湿度",
        //   key: "humidity",
        //   unit: ""
        // },
        // {
        //   icon: "iconfont icon-kongqizhuangkuang",
        //   label: "空气状况",
        //   key: "air_condition",
        //   unit: ""
        // },
        // {
        //   icon: "iconfont icon-kongqidengji",
        //   label: "空气等级",
        //   key: "air_level",
        //   unit: ""
        // },
        // {
        //   icon: "iconfont icon-kongqizhiliang",
        //   label: "空气AQI",
        //   key: "aqi",
        //   unit: ""
        // },
        // {
        //   icon: "iconfont icon-yangchen1",
        //   label: "扬尘指数",
        //   key: "yangchen",
        //   unit: ""
        // }
      ]),
      weather: {
        temperature: "-",
        aqi: "-",
        pm25: "-",
        precipitation: "-",
        windSpeed: "-",
        humidity: "-"
      }
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
      let weatherData = weatherDatas.data;
      console.log(">>>>weather", weatherDatas);
      if (weatherData) {
        this.weather = {
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          precipitation: weatherData.precipitation,
          windSpeed: weatherData.windSpeed
          // pm25: weatherData[0].content.pm25,
          // qpi: weatherData[0].content.aqi
        };
      }
      const aqiData = await getAQI();
      // console.log(">>>>aq", aqiData);
      if (aqiData) {
        aqiData.aqi_list.map(item => {
          if (item.MN === "静安区平均值") {
            this.weather = {
              ...this.weather,
              pm25: item.PM25,
              aqi: item.AQI
            };
          }
        });
        // console.log(">>>>w", this.weather);
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
  width: 16rem;
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
  justify-content: center;
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
