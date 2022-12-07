<template>
  <div id="bike">
    <m-list
      :headers="headers"
      :dataset="tableData"
    >
    </m-list>
  </div>
</template>

<script>
import { getBike } from './api.js'
import MList from '@/components/MList/index.vue'
export default {
  name: 'Bike',
  components: {
    MList
  },
  data () {
    return {
      headers: [
        {
          label: '单车名称',
          prop: 'name',
          align: 'center'
        },
        {
          label: '在线车数',
          prop: 'online',
          align: 'center'
        },
        {
          label: '活跃车数',
          prop: 'active',
          align: 'center'
        },
        {
          label: '骑行次数',
          prop: 'ride',
          align: 'center'
        }
      ],
      tableData: []
    }
  },
  created () {
    getBike().then(res => {
      this.tableData = (res.data || []).map((item, index) => {
        return {
          ...item,
          id: index
        }
      })
    })
  }
}
</script>

<style lang="scss" scoped>
#bike {}
</style>
