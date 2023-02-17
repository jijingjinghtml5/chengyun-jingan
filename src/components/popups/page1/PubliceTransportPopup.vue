<template>
  <div  class="panel">
    <div class="category">公交线路</div>
    <m-list
      :headers="headers"
      :dataset="tableData"
      @rowClick="handleRowClick"
    >
    </m-list>
  </div>
</template>
<script>
import MList from '@/components/MList/index.vue'
import { getPublicLine } from '../api.js'
export default {
  name: 'PubliceTransportPopup',
  components: {
    MList
  },
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
      headers: [
        {
          label: '线路名称',
          prop: 'name',
          align: 'center'
        }
      ],
      tableData: [],
      publicLineLayer: null
    }
  },
  created () {
    this.registerLayer()
    getPublicLine().then(res => {
      this.tableData = (res.data.messages || []).map((item, index) => {
        return {
          name: `${item.args.attributes.NAME}( ${item.args.attributes.DIRECTION} )`,
          ...item,
          id: index
        }
      })
    })
  },
  methods: {
    registerLayer () {
      this.publicLineLayer = this.$_mapProxy.registerLayer('publicLineLayer', '公交线路', this.$_mapProxy.MANUAL_GROUP, {
        'name': 'publicLineLayer',
        'type': 'polyline',
        'data': {
          'data': [],
          'parsegeometry': 'function(item){return {paths:item.data.path.points}}'
        },
        'legendVisible': true,
        'popupEnabled': true,
        'renderer': {
          'type': 'simple',
          'label': '公交线路',
          'visualVariables': [],
          'symbol': {
            'type': 'line-3d',
            'symbolLayers': [
              {
                'type': 'line',
                'size': 3,
                'material': {
                  'color': 'red'
                },
                'cap': 'round',
                'join': 'round'
              }
            ]
          }
        }
      })
    },
    handleRowClick (row) {
      if (row) {
        this.publicLineLayer.setParameters({
          'data': {
            'content': [row],
            'parsegeometry': 'function(item){return {paths:item.data.path[0].points}}'
          }
        }).open()
        this.$emit('addNewPopup', {
          key: 'PubliceTransportDetail',
          componentName: 'PubliceTransportDetail',
          showClose: true,
          mapData: {
            ...row
          },
          stylePopup: {
            paddingLeft: 0,
            left: '400px'
          }
        })
      } else {
        this.publicLineLayer.close()
      }
    }
  },
  beforeDestroy () {
    this.publicLineLayer.close()
  }
}
</script>
<style lang="scss" scoped>
.panel{
  width: 10rem;
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
}
</style>
