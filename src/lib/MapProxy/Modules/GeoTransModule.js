/**
 * 坐标转换
 */
import SHcoordinateUtil from "../coordUtils/SHcoordinateUtils.js";
const GeoTransModule = {
    // 工具方法转换为城地坐标
    transToShLocal(pointObj) {
      let { system, latitude, longitude } = pointObj;
      if (system) {
        system = system.toUpperCase();
      }
      switch (system) {
        case "WGS84":
          [longitude, latitude] = SHcoordinateUtil.WGStoSH([longitude, latitude]);
          break;
        case "GCJ02":
          [longitude, latitude] = SHcoordinateUtil.GCJtoSH([longitude, latitude]);
          break;
        case "BD09":
          [longitude, latitude] = SHcoordinateUtil.BDtoSH([longitude, latitude]);
          break;
        default:
      }
      return [longitude, latitude];
    }
};
export default GeoTransModule;
