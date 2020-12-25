import Vue from "vue";
import App from "./index.vue";
import ElementUI from "element-ui";
import "normalize.css";
import "element-ui/lib/theme-chalk/index.css";
import "@/style/index.scss";
import "@/fonts/iconfont.css";

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
Vue.use(bus, (window.$config && window.$config.wsUrl) || "");
// , (window.$config && window.$config.wsUrl) || ""
Vue.use(filters);
Vue.use(trackingWs, (window.$config && window.$config.trackingWs) || "");
Vue.use(tracking, (window.$config && window.$config.tracking) || "");

Vue.prototype.$reCallTime = window.$config.reCallTime || 10 * 60 * 1000;
new Vue({
  // router,
  render: h => h(App)
}).$mount("#app");
