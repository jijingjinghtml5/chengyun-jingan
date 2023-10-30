<template>
  <div class="container">
    <span class="iconfont icon-shijianbobao"></span>
    <marquee behavior="scroll" direction="left" loop="-1" class="content">
      {{marquee}}
    </marquee>
  </div>
</template>
<script>
export default {
  name: 'Notice',
  data () {
    return {
      txt: '涉秘场所，请勿拍摄，谢谢配合。'
    }
  },
  computed: {
    marquee () {
      return this.txt.repeat(4)
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  font-size: 52px;
  color: $titleLevel2;
  padding: 20px;
  line-height: 80px;
  height: 140px;
  border-bottom: 0.02rem solid #0F2E60;
  display: flex;
  align-content: center;
  .iconfont{
    color: #0071FF;
    .supportWebkitTextFillColor &{
      background-image: linear-gradient(180deg, #4FCFD5 0%, #0071FF 100%);
      // background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .content{
    margin-left: 40px;
    margin-right: 30px;
    color: rgb(191, 53, 70);
  }
}
</style>>
