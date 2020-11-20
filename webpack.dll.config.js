const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin");

const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: {
    vue: ["vue/dist/vue.runtime.esm.js", "vuex", "vue-router", "axios", "normalize.css"],
    chart: ["echarts", "vue-echarts"],
    "ui-element": ["element-ui"],
    "ui-ant": ["antd"],
    map: ["proj4", "@turf/turf"],
    video: ["video.js", "videojs-flash", "hls.js", "@liveqing/liveplayer"]
  },
  output: {
    filename: "[name].dll.js",
    path: path.resolve(__dirname, "dll"),
    library: "dll_[name]"
  },
  plugins: [
    new CleanWebpackPlugin(), // clean-wepback-plugin目前已经更新到2.0.0，不需要传参数path
    new webpack.DllPlugin({
      name: "dll_[name]",
      path: path.join(__dirname, "dll", "[name].manifest.json"),
      context: __dirname
    })
  ]

};
