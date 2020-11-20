/**
 * wgs 上海城建坐标相互转换
 * 有10米级，精度误差
 * 需安装proj4
 *   2019-11-22
 */
/* eslint-disable */
import proj4 from "proj4";
import ZampCoordsUtils from "./ZampCoordsUtils.js"
let SHcoordinateUtil = {
  //wgs84坐标转上海城建 参数[lon,lat]
  WGStoSH: function(data) {
    proj4.defs(
      "shlocal1",
      "+proj=tmerc +lon_0=121.467163 +lat_0=31.235434 +x_0=0 +y_0=0  +ellps=WGS84 +datum=WGS84 +k_0=1 +units=m +no_defs"
    );
    var res = proj4("shlocal1", data);
    var rx = res[0];
    var ry = res[1];
    var err_x =
      -1.51153279022372 +
      (rx / 10000.0) * 0.0820229524611545 +
      (ry / 10000.0) * 0.255890565368556;
    var err_y =
      2.0044994152667 -
      (rx / 10000.0) * 0.254853140425539 +
      (ry / 10000.0) * 0.0820493970293696;
    var real_coordx = rx + err_x;
    var real_coordy = ry + err_y;
    var x2 = real_coordx;
    var y2 = real_coordy;
    // 二次线性纠正
    err_x =
      0.491057954263098 +
      (x2 / 10000.0) * 0.163251063170758 -
      (y2 / 10000.0) * 0.000408333266113368;
    err_y =
      0.497750115591061 +
      (x2 / 10000.0) * 0.000829632345512648 +
      (y2 / 10000.0) * 0.163798831228589;
    real_coordx = x2 - err_x;
    real_coordy = y2 - err_y;
    return [real_coordx, real_coordy];
  },
  //上海城建转wgs84  参数[x,y]
  SHtoWGS: function(data) {
    proj4.defs(
      "shlocal2",
      "+proj=tmerc +lon_0=121.467163 +lat_0=31.235434 +x_0=0 +y_0=0  +ellps=WGS84 +datum=WGS84 +k_0=1 +units=m +no_defs"
    );
    proj4.defs(
      "WGS84",
      "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"
    );
    var res = proj4("shlocal2", "WGS84", data);
    var rx = res[0];
    var ry = res[1];
    var err_x =
      0.00250135507339599 -
      res[0] * 1.16351950848744e-5 -
      res[1] * 3.42854049203957e-5;
    var err_y =
      -0.00292909033177498 +
      res[0] * 2.53739773884895e-5 -
      res[1] * 5.49535857571321e-6;
    var real_coordx = res[0] - err_x;
    var real_coordy = res[1] - err_y;
    return [real_coordx, real_coordy];
  },
  GCJtoSH: function(data) {
    let coord1 = ZampCoordsUtils.GCJtoWGS(data);
    return this.WGStoSH(coord1);
  },
  BDtoSH: function(data) {
    let coord1 = ZampCoordsUtils.BDtoWGS(data);
    return this.WGStoSH(coord1);
  }

};

export default SHcoordinateUtil