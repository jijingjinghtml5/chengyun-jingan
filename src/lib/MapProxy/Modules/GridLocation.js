/**
 * 责任网格定位
 * @method showGrid(gridCode)
 * @method closeGrid()
 */
const GridModule = {
  gridLayerName: "_gridLayer",
  gridLayer: null,

  showGrid(gridCode) {
    this.gridLayer.setParameters({
      "data": {
          "layers": {
            "name": "责任网格",
            "where": "网格编码='" + gridCode + "'"
          }
      }
    }).open();
  },

  closeGrid() {
    let cmd = {
      ActionName: "ShowData",
      Parameters: JSON.stringify({
        "type": "layer",
        "mode": "delete",
        "isLocate": true,
        "data": {
          "layers": {
            "name": "责任网格"
          }
        }
      })
    };
    this.gridLayer.closeOrigin(cmd);
  },

  init() {
    this.gridLayer = this._registerGridLayer();
  },
  _registerGridLayer() {
    return this.registerLayer(this.gridLayerName, "责任网格图层", null, {
      "type": "layer",
      "isLocate": true,
      "data": {
        "layers": {
          "name": "责任网格",
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
export default GridModule;
