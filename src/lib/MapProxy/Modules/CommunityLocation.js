/**
 * 居委会边界定位
 * @method showCommunity(communityName)
 * @method closeCommunity()
 */
const CommunityModule = {
  communityLayerName: "_communityLayer",
  communityLayer: null,

  showCommunity(communityName) {
    this.communityLayer.setParameters({
      "data": {
          "layers": {
            "name": "居委会",
            "where": "居委会名称='" + communityName + "'"
          }
      }
    }).open();
  },

  closeCommunity() {
    let cmd = {
      ActionName: "ShowData",
      Parameters: JSON.stringify({
        "name": this.communityLayerName,
        "type": "layer",
        "mode": "delete",
        "isLocate": true,
        "data": {
          "layers": {
            "name": "居委会"
          }
        }
      })
    };
    this.communityLayer.closeOrigin(cmd);
  },

  init() {
    this.communityLayer = this._registercommunityLayer();
  },
  _registercommunityLayer() {
    return this.registerLayer(this.communityLayerName, "居委会图层", null, {
      "type": "layer",
      "isLocate": true,
      "data": {
        "layers": {
          "name": "居委会",
          "where": ""
        }
      },
      "renderer": {
        "type": "simple",
        "symbol": {
          "type": "line-3d",
          "symbolLayers": [
            {
              "type": "line",
              "size": 5,
              "material": {
                "color": [0, 255, 255, 1]
              }
            }
          ]
        }
        }
    });
  }
};
export default CommunityModule;
