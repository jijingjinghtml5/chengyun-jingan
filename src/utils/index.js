const isEmpty = function(value, allowEmptyString) {
  return (
    value === null ||
      value === undefined ||
      (!allowEmptyString ? value === "" : false) ||
      (isArray(value) && value.length === 0)
  );
};
const isArray =
  "isArray" in Array
    ? Array.isArray
    : function(value) {
      return toString.call(value) === "[object Array]";
    };

export function obj2Param(obj) {
  return Object.keys(obj)
    .filter(i => (obj[i] === false ? String(obj[i]) : obj[i]))
    .map(n =>
      Array.isArray(obj[n]) ? arrayParams(n, obj[n]) : [n, obj[n]].join("=")
    );
}

function arrayParams(n, arr) {
  const paramsName = [n, "[]"].join("");
  let formatArr = [];
  arr.forEach(i => {
    formatArr.push([paramsName, i].join("="));
  });

  return formatArr.join("&");
}

export function formatterDate(val, fmt) {
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
}

export function getParams (name) {
  const hash = location.href;
  const params = (hash.split("?")[1] || "").replace(/#\/.*$/, "");
  let paramsArr = [];
  const paramsObj = {};

  if (params && params.length > 0) {
    paramsArr = params.split("&");
    paramsArr.map(function (i) {
      const item = i.split("=");
      const name = item[0];
      const value = decodeURIComponent(item[1]);
      paramsObj[name] = value;
    });
  }
  if (isEmpty(name)) {
    return paramsObj;
  } else {
    return paramsObj[name] ? paramsObj[name] : undefined;
  }
}

const addParamForUrl = (function() {
  let params = getParams();
  return function(url, key) {
    let value = params[key];
    // eslint-disable-next-line no-useless-escape
    let reg = new RegExp(`([\?&]${key}=)[^&]*`, "g");
    if (!url || !value || reg.test(url)) return url || "";
    return url + (url.split("?").length > 1 ? "&" : "?") + key + "=" + value;
  };
})();

export {
  addParamForUrl
};

export function statisticsForKey(key, source) {
  let res = {};
  (source || []).reduce((a, c, i) => {
    if (c[key]) {
      if (!a.hasOwnProperty(c[key])) {
        a[c[key]] = 0;
      }
      a[c[key]]++;
    }
    return a;
  }, res);
  return res;
}

export function generateKeyValuePair (key, val, source) {
  let res = {};
  let arr = source || [];
  if (!arr.reduce) {
    arr = [...arr];
  }
  arr.reduce((a, c, i) => {
    if (c[key]) {
      a[c[key]] = c[val];
    }
    return a;
  }, res);
  return res;
}

export function isIE () {
  let ua = navigator.userAgent;
  return (ua.indexOf("compatible") > -1 && ua.indexOf("MSIE") > -1) || (ua.indexOf("Trident") > -1 && ua.indexOf("rv:11.0" > -1));
}

export function asyncLoadScripts(scripts) {
  if (!scripts || !scripts.length) return Promise.reject(new Error("scripts empty"));
  let head = document.getElementsByTagName("head")[0];
  let hasScripts = document.getElementsByTagName("script");
  let hasScriptsMapping = generateKeyValuePair("src", "src", hasScripts);
  let promiseArr = [];
  scripts.forEach(url => {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    if (!hasScriptsMapping[script.src]) {
      promiseArr.push(new Promise((resolve, reject) => {
        script.onload = script.onreadystatechange = function () {
          if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
            script.onload = script.onreadystatechange = null;
            resolve();
          } else {
            reject(new Error("script load error"));
          }
        };
      }));
      head.appendChild(script);
    } else {
      script = null;
    }
  });
  return Promise.all(promiseArr);
}
