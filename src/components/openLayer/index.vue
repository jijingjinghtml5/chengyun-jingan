<template>
    <div id="layermap" class="open-layer-container"></div>
</template>
<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { TileWMS } from 'ol/source'
import { transform } from 'ol/proj'
import { getLastMapBase } from './api'
export default ({
    data() {
        return {
            layerName: '',
            map: null
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initLayerName()
        })
    },
    methods: {
        initLayerName() {
            getLastMapBase().then(res => {
                const { data = {} } = res || {}
                this.layerName = data.layer || ''
                this.initMap()
            })
        },
        initMap() {
            const mapLayer = new TileLayer({
                source: new TileWMS({
                    url: 'https://geo.spacel.net/geoserver/wms',
                    params: {
                        'LAYERS': this.layerName || 'sh_jingan_chengyun:jingan202309_mos_wgs84',
                        'TILED': true,
                        'FORMAT': 'image/vnd.jpeg-png8'
                    },
                    serverType: 'geoserver'
                })
            })

            this.map = new Map({
                layers: [mapLayer],
                target: 'layermap',
                view: new View({
                    center: transform([121.459337, 31.2820], 'EPSG:4326', 'EPSG:3857'), // 地图初始中心点
                    projection: 'EPSG:3857',
                    zoom: 14,
                    minZoom: 12
                })
            })
        }
    }
})
</script>
<style lang="scss" scoped>
.open-layer-container {
    width: 100%;
    height: 100%;
    /deep/ .ol-layers {
        z-index: -1 !important;
    }
}
</style>