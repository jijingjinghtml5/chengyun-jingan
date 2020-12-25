<template>
  <div id="app">
    <layout v-if="isLogin"></layout>
  </div>
</template>

<script>
import Layout from "./Layout";
import LoginMixins from "@/pages/Login/mixins/Login.js";
export default {
  name: "App",
  mixins: [LoginMixins],

  components: {
    Layout
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
}
</style>
