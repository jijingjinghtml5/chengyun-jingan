const TerserPlugin = require("terser-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const path = require("path");
const scssVariables = require("./src/style/var.js");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "./",
  pages: {
    page1: {
      entry: "src/pages/page1/entry.js",
      template: "public/index.html",
      filename: "page1.html",
      title: "静安城运",
      chunks: ["chunk-vendors", "chunk-common", "page1"]
    },
    login: {
      entry: "src/pages/Login/entry.js",
      template: "public/login.html",
      filename: "login.html",
      title: "登陆",
      chunks: ["chunk-vendors", "chunk-common", "login"]
    }
  },
  productionSourceMap: false,
  css: {
    loaderOptions: {
      scss: {
        data: Object.keys(scssVariables)
          .map(k => `\$${k.replace("_", "-")}: ${scssVariables[k]};`)
          .join("\n")
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .tap(options => Object.assign(options, { limit: 1024 }));
    config.resolve.alias.set("@res", resolve("../chengyun_components/src"));
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      // GZIP 减小请求体积
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: "gzip",
          test: new RegExp("\\.(" + ["js", "css"].join("|") + ")$"),
          threshold: 10240,
          minRatio: 0.8
        })
      );
      Object.assign(config.optimization, {
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true, // console
                drop_debugger: false,
                pure_funcs: ["console.log"] // 移除console
              }
            }
          })
        ]
      });
    }
  },
  devServer: {
    https: false,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,GET",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Accept, Origin, Authorization, code"
    }
  }
};
