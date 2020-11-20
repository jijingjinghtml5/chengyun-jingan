var toString = Object.prototype.toString;
var isEmpty = function(value, allowEmptyString) {
  return (
    value === null ||
    value === undefined ||
    (!allowEmptyString ? value === "" : false) ||
    (isArray(value) && value.length === 0)
  );
};
var isArray =
  "isArray" in Array
    ? Array.isArray
    : function(value) {
        return toString.call(value) === "[object Array]";
      };
var getParams = function(name) {
  var hash = location.hash || location.href;
  var params = hash.split("?")[1];
  let paramsArr = [];
  let paramsObj = {};

  if (params && params.length > 0) {
    paramsArr = params.split("&");
    paramsArr.map(function(i) {
      var item = i.split("=");
      var name = item[0];
      var value = decodeURIComponent(item[1]);
      paramsObj[name] = value;
    });
  }
  if (isEmpty(name)) {
    return paramsObj;
  } else {
    return paramsObj[name] ? paramsObj[name] : undefined;
  }
};
var formatterDate = function(val, fmt) {
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
};
var convertData = function(val, type) {
  switch (type) {
    case "time":
      if (!isNaN(+val)) {
        val = formatterDate(
          parseInt((val + "000").slice(0, 13)),
          "yyyy-MM-dd hh:mm"
        );
        console.log(val);
      }
      break;
  }
  return val;
};
