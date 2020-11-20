/**
 * 轨迹
 * @method showTrack(data)
 * @method closeTrack()
 */
const TrackModule = {
  trackLayerName: "_trackLayer",
  trackLayer: null,

  showTrack(data, groupId) {
    if (!groupId) {
      groupId = this.getNewGroupId();
    }
    this.trackLayer.setGroupId(groupId).setParameters({
      "mode": "add",
      "data": {
        "isComputingRote": true,
        "content": data,
        "parsegeometry": "function(item){return {x:Number(item.lon),y:Number(item.lat)}}"
      }
    }).open();
  },

  closeTrack() {
    this.trackLayer.closeOrigin({
      ActionName: "ShowData",
      Parameters: JSON.stringify({
        "name": this.trackLayerName,
        "mode": "delete",
        "data": {
          "isComputingRote": true,
          "content": [],
          "parsegeometry": "function(item){return {x:Number(item.lon),y:Number(item.lat)}}"
        }
      })
    });
  },

  init() {
    this.trackLayer = this._registerTrackLayer();
  },
  _registerTrackLayer() {
    return this.registerLayer(this.trackLayerName, "轨迹", null, {
      "name": this.trackLayerName,
      "type": "point",
      "mode": "add",
      "data": {
        "isComputingRote": true,
        "content": [],
        "parsegeometry": "function(item){return {x:Number(item.lon),y:Number(item.lat)}}"
      },
      "legendVisible": false,
      "popupEnabled": false,
      "renderer": {
        "type": "unique-value",
        "uniqueValueInfos": [
          {
            "value": "line",
            "symbol": {
              "type": "line-3d",
              "symbolLayers": [
                {
                  "type": "line",
                  "size": 8,
                  "material": {
                    "color": [0, 255, 0, 1]
                  },
                  "cap": "round",
                  "join": "round"
                }
              ]
            }
          },
          {
            "value": "start",
            "symbol": {
              "type": "simple-marker",
              "size": 20,
              "color": [0, 0, 0, 0],
              "outline": {
                "width": 0.5,
                "color": [0, 0, 0, 0]
              }
            }
          },
          {
            "value": "end",
            "symbol": {
              "type": "simple-marker",
              "size": 20,
              "color": [0, 0, 0, 0],
              "outline": {
                "width": 0.5,
                "color": [0, 0, 0, 0]
              }
            }
          }
        ]
      }
    });
  }
};
export default TrackModule;
