import Vue from "vue";
import App from "./index.vue";
import "normalize.css";
import "@/fonts/iconfont.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/style/index.scss";

import "echarts";
import VueChart from "vue-echarts";

import bus from "@/lib/websocket/eventProxy";
import filters from "@/lib/GlobalFilters";
import "@/lib/OverWrite";

// map Proxy
import MapProxy from "@/lib/MapProxy/MapProxy";
import TimingTrigger from "@/plugins/TimingTrigger";

Vue.config.productionTip = false;
Vue.use(bus, (window.$config && window.$config.wsUrl) || "");

Vue.component("VChart", VueChart);
Vue.use(ElementUI);

Vue.use(filters);
Vue.use(MapProxy);
Vue.use(TimingTrigger);

Vue.prototype.$reCallTime = window.$config.reCallTime || 10 * 60 * 1000;
new Vue({
  render: h => h(App)
}).$mount("#app");
