<template>
  <div  class="panel">
    <div class="category">{{ info.name }}</div>
    <div class="list">
      <div class="list-item" v-for="item in info.list" :key="item.id" :class="{ active: current === item.id }" @click="handleClick(item)">
        <p class="name">{{ item.name }}</p>
        <p>电话：{{ item.phone }}</p>
        <p>地址：{{ item.address }}</p>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'DangPopup',
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      current: ''
    }
  },
  methods: {
    handleClick (item) {
      if (this.current === item.id) {
        this.$_mapProxy.clearPosition()
        this.$_mapProxy.fullExtent()
        this.current = ''
        return
      }
      this.current = item.id
      let coords = this.$_mapProxy.transToShLocal({
        system: 'GCJ02',
        longitude: item.lng,
        latitude: item.lat
      })
      this.$_mapProxy.goToPosition(coords[0], coords[1])
    }
  }
}
</script>
<style lang="scss" scoped>
.panel{
  width: 8rem;
  height: 15.6rem;
  padding: 0.4rem;
  border: 1px solid #4E78A4;

  font-size: 16*2px;
  color:rgba(146, 185, 247, 1);
  .category{
    width: 100%;
    font-size:22*2px;
    font-family:MicrosoftYaHei;
    color:rgba(146,185,247,1);
  }
  .list {
    &-item {
      &.active {
        background-color: rgba(146,185,247,0.5);
      }
      border-radius: 0.1rem;
      margin-top: 0.15rem;
      background-color: #000000;
      padding: 0.15rem;
      color: #FFFFFF;
      line-height: 0.5rem;
      .name {
        color: rgb(252, 191, 81);
        font-size: 0.4rem;
      }
    }
  }
}
</style>
