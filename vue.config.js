const TerserPlugin = require("terser-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const version = require("./version");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

// function generateVersion() {
//   const date = new Date();
//   return date.getTime();
// }

module.exports = {
  publicPath: "./",
  pages: {
    page1: {
      entry: "src/pages/page1/entry.js",
      template: "public/index.html",
      filename: "page1.html",
      title: "page1",
      chunks: ["chunk-vendors", "chunk-common", "page1"]
    },
  },
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        // data: `@import "src/style/app.scss";`
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .tap(options => Object.assign(options, { limit: 1024 }));
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
      // config.plugins.push(
      //   new HtmlWebpackPlugin({
      //     filename: "version.html",
      //     template: "./public/version.html",
      //     inject: false,
      //     minify: {
      //       removeComments: false,
      //       collapseWhitespace: true,
      //       removeAttributeQuotes: true
      //     },
      //     version: version
      //   })
      // );
      Object.assign(config.optimization, {
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                // warnings: false,
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
