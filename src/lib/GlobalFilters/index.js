const filters = {
  thousandCentimeter: function(num) {
    return (num || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
  },
  formatterDate: function(val, fmt) {
    if (val === "-") return "-";
    if (!val) return "";
    var time = new Date(val || 0);
    var o = {
      "M+": time.getMonth() + 1, // 月份
      "d+": time.getDate(), // 日
      "h+": time.getHours(), // 小时
      "m+": time.getMinutes(), // 分
      "s+": time.getSeconds(), // 秒
      "q+": Math.floor((time.getMonth() + 3) / 3), // 季度
      S: time.getMilliseconds() // 毫秒
    };
    let yearRegExp = /(y+)/;
    if (yearRegExp.test(fmt)) {
      fmt = fmt.replace(
        yearRegExp,
        (time.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    for (var k in o) {
      let reg = new RegExp("(" + k + ")");
      if (reg.test(fmt)) {
        fmt = fmt.replace(
          reg,
          RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
        );
      }
    }
    return fmt;
  },
  initVal: function(val, d = "-") {
    return val === null || val === undefined ? d : val;
  }
};

export default {
  install: function(Vue, option) {
    Vue.mixin({
      filters: {
        ...(filters || {})
      }
    });
    Vue.prototype.$f = {
      ...(filters || {})
    };
  }
}
;
