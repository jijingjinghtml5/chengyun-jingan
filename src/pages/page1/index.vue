<template>
  <div id="app">
    <layout></layout>
  </div>
</template>

<script>
import Layout from "./Layout";
export default {
  name: "App",

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
