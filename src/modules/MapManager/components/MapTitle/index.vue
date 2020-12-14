<template>
  <div class="MapTitleContainer">
    <div class="tilte">上海市静安区城市运行管理平台</div>
    <div class="map-tab">
      <header-menu
        :mapControlItem="mapControlItem"
        :checkItems="checkItems"
        :mapControlItemData="mapControlItemData"
        :formatMethod="formatMethods"
      ></header-menu>
    </div>
  </div>
</template>
<script>
import HeaderMenu from "@/lib/MapHeader/HeaderMenu";

export default {
  name: "MapTitle",
  components: {
    HeaderMenu

  },
  data() {
    return {
      formatMethods: {

      },
     mapControlItem: [
        { name: "人(万人)", iconClass: "icon-renqunjuji", attr: "people", isExpand: true, columns: 2 },
        { name: "地(个)", iconClass: "icon-bangonglouyu", attr: "area", isExpand: true, columns: 2 },
        { name: "物(台)", iconClass: "icon-wulianganzhi1", attr: "thing", isExpand: true, columns: 2 },
        { name: "事(个)", iconClass: "icon-jinriguanzhu", attr: "event", isExpand: true, radio: true, columns: 2 },
        { name: "情(件)", iconClass: "icon-wu", attr: "situation", isExpand: true, columns: 2, disable: true },
        { name: "组织(个)", iconClass: "icon-luchangzhi", attr: "organization", isExpand: true, radio: true, columns: 2, disable: true }
      ],
      mapControlItemData: {
        people: "820",
        area: "171",
        thing: "3433",
        event: "89",
        situation: "901",
        organization: "121"
      },
      checkItems: {
        people: [
              {
                name: "户籍人口",
                nameKey: "name",
                checked: false
              },
              {
                name: "来沪人口",
                nameKey: "name",
                checked: false
              },
              {
                name: "境外人口",
                nameKey: "name",
                checked: false
              },
              {
                name: "特殊人群",
                nameKey: "name",
                checked: false
              }
        ],
        thing: [
          {
            name: "城市部件",
            nameKey: "name",
            checked: false
          },
          {
            name: "地下管线",
            nameKey: "name",
            checked: false
          },
          {
            name: "神经元传感器",
            nameKey: "name",
            checked: false
          }
        ],
        area: [
              {
                name: "公共设施",
                nameKey: "name",
                children: [
                  {
                    name: "学校",
                    nameKey: "name",
                    checked: false
                  },
                                    {
                    name: "医院",
                    nameKey: "name",
                    checked: false
                  },
                  {
                    name: "养老院",
                    nameKey: "name",
                    checked: false
                  }
                ],
                childKey: "children"
              },
              {
                name: "公共设施",
                nameKey: "name",
                children: [
                  {
                    name: "学校",
                    nameKey: "name",
                    checked: false
                  },
                  {
                    name: "医院",
                    nameKey: "name",
                    checked: false
                  },
                  {
                    name: "养老院",
                    nameKey: "name",
                    checked: false
                  }
                ],
                childKey: "children"
              },
              {
                name: "商业楼宇",
                nameKey: "name",
                checked: false
              },
              {
                name: "休闲购物广场",
                nameKey: "name",
                checked: false
              },
              {
                name: "基础设施",
                nameKey: "name",
                children: [
                    {
                      name: "公园",
                      nameKey: "name",
                      checked: false
                    },
                    {
                      name: "绿地",
                      nameKey: "name",
                      checked: false
                    },
                    {
                      name: "跑道",
                      nameKey: "name",
                      checked: false
                    },
                    {
                      name: "健身设施",
                      nameKey: "name",
                      checked: false
                    },
                    {
                      name: "文化场所",
                      nameKey: "name",
                      checked: false
                    }

                ],
                childKey: "children"
              }
        ],
        event: [
              {
                name: "主动",
                nameKey: "name",
                checked: false
              },
              {
                name: "被动",
                nameKey: "name",
                checked: false
              },
              {
                name: "自动",
                nameKey: "name",
                checked: false
              }
        ],
        situation: [
              {
                name: "舆情",
                nameKey: "name",
                checked: false
              },
              {
                name: "火情",
                nameKey: "name",
                checked: false
              },
              {
                name: "警情",
                nameKey: "name",
                checked: false
              }
        ],
        organization: [
              {
                name: "工商组织",
                nameKey: "name",
                checked: false
              },
              {
                name: "公益组织",
                nameKey: "name",
                checked: false
              }
        ]
      }

    };
  },
  computed: {

  },
  methods: {
  registerPointLayer() {
      // 地图撒点图层
      this.pointLayer = this.$_mapProxy.registerLayer("HeaderPointLayer", "单个撒点图层")
      .setParameters({
        "name": "HeaderPointLayer",
        "type": "point",
        "mode": "replace",
        "data": {
          "content": [],
          "parsegeometry": "function(item){return {x:item.lng, y:item.lat}}"
        },
        "legendVisible": false,
        "popupEnabled": false,
        "isFiltered": true,
        "isLocate": false,
        "renderer": {
          type: "simple",
          symbol: {
            type: "simple-marker",
            size: 20,
            color: [0, 255, 244],
            outline: {
              color: "#ffffff",
              width: "1px"
            }
          }
        }
      });
    }

  },
  created() {
    this.registerPointLayer();
  },
  mounted() {
      this.$bus.$on("map-header-menu-choose", res => {
        const { status, item } = res;
        this.$_mapProxy.getMap()._closePopup();
        switch (item.attr) {
          case "juwei":
            if (status === 1) {
              this.pointLayer.setParameters({
                "data": {
                    "content": [{ "x": -1733, "y": -917 }],
                    "parsegeometry": "function(item){return {x:item.x, y:item.y}}"
                  },
                "renderer": {
                  type: "simple",
                  symbol: {
                    type: "simple-marker",
                    size: 30,
                    color: [0, 255, 244],
                    outline: {
                      color: "#ffffff",
                      width: "1px"
                    }
                  }
                }
              }).open();
            } else {
               this.pointLayer.close();
            }
            break;
          case "yuanqu":
            if (status === 1) {
              this.pointLayer.setParameters({
                "data": {
                    "content": [{ "x": -1833, "y": -967 }],
                    "parsegeometry": "function(item){return {x:item.x, y:item.y}}"
                  },
                "renderer": {
                  type: "simple",
                  symbol: {
                    type: "simple-marker",
                    size: 30,
                    color: [0, 255, 0],
                    outline: {
                      color: "#ffffff",
                      width: "1px"
                    }
                  }
                }
              }).open();
            } else {
               this.pointLayer.close();
            }
            break;
          case "shangpu":
            if (status === 1) {
              this.pointLayer.setParameters({
                "data": {
                    "content": [{ "x": -1733, "y": -817 }],
                    "parsegeometry": "function(item){return {x:item.x, y:item.y}}"
                  },
                "renderer": {
                  type: "simple",
                  symbol: {
                    type: "simple-marker",
                    size: 30,
                    color: [255, 255, 0],
                    outline: {
                      color: "#ffffff",
                      width: "1px"
                    }
                  }
                }
              }).open();
            } else {
               this.pointLayer.close();
            }
            break;
          case "gongdi":
            if (status === 1) {
              this.pointLayer.setParameters({
                "data": {
                    "content": [{ "x": -1633, "y": -967 }],
                    "parsegeometry": "function(item){return {x:item.x, y:item.y}}"
                  },
                "renderer": {
                  type: "simple",
                  symbol: {
                    type: "simple-marker",
                    size: 30,
                    color: [0, 0, 255],
                    outline: {
                      color: "#ffffff",
                      width: "1px"
                    }
                  }
                }
              }).open();
            } else {
               this.pointLayer.close();
            }
            break;
        }

        console.log(res, "res-----------");
      });

      this.$bus.$on("map-header-item-choose", res => {

      });
  }
};
</script>
<style lang="scss" scoped>
.MapTitleContainer {
  user-select: none;
  position: absolute;
  background-image:url(./img/MapBG.png);
  background-size: contain;
  // background-repeat:no-repeat;
  width: 100%;
  height:  3rem;
}
.tilte {
  user-select: none;
  position: relative;
  width: 100%;
  height:  1.5rem;
  line-height: 1.5rem;
  text-align: center;
  font-size: 0.96rem;
  color: #ffffff;
  font-weight: bold;

}
.map-tab{
  position: relative;

  margin: 0.23rem auto 0 auto;
  width: 85%;

}
</style>
