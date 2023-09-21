<template>
  <div class="login-page">
    <div class="top-bar">
      上海市静安区城市运行管理平台
    </div>
    <div class="form">
      <el-form
        v-if="preLogin"
        width="400"
        :model="loginForm"
        :rules="rules"
        class="form login-form"
        ref="loginForm"
        size="middle"
      >
        <el-form-item prop="username">
          <el-input
            class="input-username"
            prefix-icon="iconfont icon-yonghumingbeifen"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            @keyup.enter.native="login"
            prefix-icon="iconfont icon-mima"
            type="password"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>

        <el-form-item label>
          <el-button :loading="loading" @click="login" class="login-btn"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
      <div v-else>
        <iframe
          ref="qrcodeIframe"
          name="qrcodeIframe"
          :src="qrcodeUrl"
          allowTransparency="true"
          scrolling="no"
          class="qrcode-iframe"
        ></iframe>
        <div class="change-page" @click="preLogin = true">切换账号</div>
      </div>
    </div>
  </div>
</template>
<script>
import { login, scanCheck, login_new } from "@/http/api";
import { setCode } from "@/utils/code";
import { getParams } from "@/utils/";
import { Message } from "element-ui";

export default {
  name: "Login",
  data() {
    const state = getParams()["code"];
    let iframeUrl = "";
    if (window.$config.WwLogin) {
      const { host, appid, agentid, redirectUri } =
        window.$config["WwLogin"] || {};
      iframeUrl =
        host +
        "/wwopen/sso/qrConnect?appid=" +
        appid +
        "&agentid=" +
        agentid +
        "&redirect_uri=" +
        redirectUri +
        "&state=" +
        state +
        "&login_type=jssdk";
    }

    return {
      loading: false,
      params: getParams(),
      rules: {
        username: { required: true, message: "请输入用户名", trigger: "blur" },
        password: { required: true, message: "请输入密码", trigger: "blur" },
      },
      loginForm: {
        username: "",
        password: "",
      },

      withQr: !!window.$config.WwLogin,
      qrcodeUrl: iframeUrl,
      preLogin: true,
      token: null,
      access_token: null,
    };
  },
  watch: {
    preLogin: {
      handler(nv) {
        if (nv) {
          window.removeEventListener("message", this.eventHandle);
        }
      },
    },
  },
  methods: {
    randomCoding(len) {
      let str = "";
      let code;
      let arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
      for (let i = 0; i < len; i++) {
        code = arr[Math.floor(Math.random() * arr.length)];
        str += code;
      }

      return str;
    },
    encryptPassword(password) {
      let encrypt;
      encrypt = this.randomCoding(3);
      encrypt += btoa(password);
      return encrypt;
    },
    // 第一步验证 验证账号密码 登陆
    async login() {
      const code = this.params.code || "";
      setCode(code);
      const valid = await this.$refs.loginForm.validate();
      if (valid) {
        this.loading = true;
        try {
          const res = await login_new({ ...this.loginForm, project: "screen", password: this.encryptPassword(this.loginForm.password), encrypt: 1 });
          if (res.code == 200) {
            this.token = res.response.data.token;
            this.access_token = res.response.data.token;
            if (this.withQr) {
              this.withQrCode();
            } else {
              this.afterLogin();
            }
          } else {
            Message.error(res.message || "用户名或密码错误");
          }
        } catch (error) {
          Message.error(error || "用户名或密码错误");
        } finally {
          this.loading = false;
        }
      } else {
        return false;
      }
    },
    // 第二部验证验证政务微信二维码
    async checkQrCode() {},
    withQrCode() {
      this.preLogin = false;
      this.$nextTick(() => {
        const frame = this.$refs.qrcodeIframe;
        frame.onload = () => {
          console.log("qr iframe load");
          if (frame.contentWindow.postMessage && window.addEventListener) {
            window.addEventListener("message", this.eventHandle);
            frame.contentWindow.postMessage("ask_usePostMessage", "*");
          }
        };
      });
    },
    getDomainFromUrl(url) {
      if (url == "") {
        url = window.location.href;
      }
      const regex = /^https?:\/\/([^\/]+)/i;
      const match = url.match(regex);
      return match[1];
    },
    afterLogin() {
      // 登陆成功 设置信息 跳转页面
      const redirectUrl = this.params.redirect_url;
      window.sessionStorage.setItem("token", this.token);
      const time = Date.parse(new Date()) + 86400 * 1000;
      window.sessionStorage.setItem("_t", time);
      console.log(this.getDomainFromUrl(redirectUrl), 1111)
      console.log(this.getDomainFromUrl(window.location.href), 2222)
      if (this.getDomainFromUrl(redirectUrl) == this.getDomainFromUrl(window.location.href)) {
        window.location.href = redirectUrl;
      } else if (redirectUrl.indexOf('?') > -1) {
        window.location.href = redirectUrl + '&token=' + this.token
      } else {
        window.location.href = redirectUrl + '?token=' + this.token
      }
    },
    async eventHandle(event) {
      if (typeof event.data === "string") {
        console.log("event.data", event.data);
        const code = this.getWxResCode(event.data);
        scanCheck({
          access_token: this.access_token,
          wx_code: code,
        })
          .then((res) => {
            switch (res.status) {
              case 0:
                Message.error("校验失败，请切换账号重新登陆");
                this.preLogin = true;
                break;
              case 1:
                this.afterLogin();
                break;
              default:
                Message.error(res.message || "操作失败");
                if (this.$refs.qrcodeIframe) {
                  window.open(this.qrcodeUrl, "qrcodeIframe", "");
                }
            }
          })
          .catch((err) => {
            Message.error(err || "操作失败");
          });
      }
    },
    getWxResCode(url) {
      console.log("url", url);
      if (!url) return "";
      const params = (url.split("?")[1] || "").replace(/#\/.*$/, "");
      let paramsArr = [];
      const paramsObj = {};

      if (params && params.length > 0) {
        paramsArr = params.split("&");
        paramsArr.map(function(i) {
          const item = i.split("=");
          const name = item[0];
          const value = decodeURIComponent(item[1]);
          paramsObj[name] = value;
        });
      }
      return paramsObj["code"] || "";
    },
  },
};
</script>

<style lang="scss" scoped>
.login-page {
  width: 7680px;
  height: 2160px;
  background: url("./images/bg.png") no-repeat center center;
  background-size: 100% 100%;
  position: relative;

  .top-bar {
    width: 100%;
    height: 218px;
    background: url("./images/title_bg.png") no-repeat center center;
    background-size: 100% 100%;
    text-align: center;
    line-height: 218px;
    font-size: 96px;
    color: #ffffff;
  }
  .form {
    position: absolute;
    width: 849 * 2px;
    height: 473 * 2px;
    background: url("./images/form_bg.png") no-repeat center center;
    background-size: 100% 100%;
    margin: 0 auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    /deep/ .el-form {
      .el-form-item {
        margin-bottom: 64px;
        width: 800px;
      }

      .el-input__inner {
        height: 78px !important;
        line-height: 78px !important;
        border-radius: 0;
        border: 2px solid #80d8ff;

        font-size: 48px !important;
        width: 100% !important;
        background-color: #031125;
        color: #fff;

        padding: 0 90px !important;
      }
      .el-input__prefix {
        position: absolute;
        height: 100%;
        left: 30px;
        top: 0;
        text-align: center;
        color: #c0c4cc;
        transition: all 0.3s;
        .iconfont {
          color: #80d8ff;
          font-size: 30px;
        }
      }
      .el-form-item__error {
        padding-left: 80px;
        font-size: 40px !important;
      }

      .login-btn {
        width: 100%;
        height: 90px;
        font-size: 48px !important;
        background: linear-gradient(180deg, #00c6fb 0%, #005bea 100%);
        border: 0;
        color: #ffffff;
      }
    }
  }
}
.qrcode-iframe {
  width: 300px;
  height: 400px;
  border: 0;
}
.change-page {
  width: 100%;
  text-align: center;
  cursor: pointer;
  font-size: 24px;
  color: #eee;
}
/deep/ input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px #031125 inset;
  -webkit-text-fill-color: #fff;
}
</style>
