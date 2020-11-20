/**
 * 街镇边界定位
 * @method showStreet(streetName)
 * @method closeStreet()
 */
const StreetModule = {
  streetLayerName: "_streetLayer",
  streetLayer: null,

  showStreet(streetName) {
    this.streetLayer.setParameters({
      "data": {
          "layers": {
            "name": "街道乡镇",
            "where": "街道名称='" + streetName + "'"
          }
      }
    }).open();
  },

  closeStreet() {
    let cmd = {
      ActionName: "ShowData",
      Parameters: JSON.stringify({
        "name": this.streetLayerName,
        "type": "layer",
        "mode": "delete",
        "isLocate": true,
        "data": {
          "layers": {
            "name": "街道乡镇"
          }
        }
      })
    };
    this.streetLayer.closeOrigin(cmd);
  },

  init() {
    this.streetLayer = this._registerStreetLayer();
  },
  _registerStreetLayer() {
    return this.registerLayer(this.streetLayerName, "街道乡镇图层", null, {
      "type": "layer",
      "isLocate": true,
      "data": {
        "layers": {
          "name": "街道乡镇",
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
export default StreetModule;
