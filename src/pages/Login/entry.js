import Vue from "vue";
import App from "./index.vue";
import ElementUI from "element-ui";
import "normalize.css";
import "element-ui/lib/theme-chalk/index.css";
import "@/style/index.scss";
import "@/fonts/iconfont.css";
import config from '@/config/index'

// import router from "./router";
import bus from "@/lib/websocket/eventProxy";
import filters from "@/lib/GlobalFilters";
import "@/lib/OverWrite";

// import numberProcess from "@/plugin/numberProcess";
// import timeProcess from "@/plugin/timeProcess";
// import dataProcess from "@/plugin/dataProcess";

// tracking
import trackingWs from "@/lib/tracking/trackingProxy";
import tracking from "@/lib/tracking/trackingHttp";

// Vue.use(numberProcess);
// Vue.use(timeProcess);
// Vue.use(dataProcess);

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(bus, (config && config.wsUrl) || "");
Vue.use(filters);
Vue.use(trackingWs, (config && config.trackingWs) || "");
Vue.use(tracking, (config && config.tracking) || "");

Vue.prototype.$reCallTime = config.reCallTime || 10 * 60 * 1000;
new Vue({
  // router,
  render: h => h(App)
}).$mount("#app");
