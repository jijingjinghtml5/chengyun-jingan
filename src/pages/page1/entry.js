import Vue from "vue";
import App from "./index.vue";
import "normalize.css";
import "@/style/index.scss";
import "@/fonts/iconfont.css";

import bus from "@/lib/websocket/eventProxy";
import filters from "@/lib/GlobalFilters";
import "@/lib/OverWrite";

// map Proxy
import MapProxy from "@/lib/MapProxy/MapProxy";

Vue.config.productionTip = false;
Vue.use(bus, (window.$config && window.$config.wsUrl) || "");

Vue.use(filters);
Vue.use(MapProxy);

Vue.prototype.$reCallTime = window.$config.reCallTime || 10 * 60 * 1000;
new Vue({
  render: h => h(App)
}).$mount("#app");
