
// 定时调用接口
export function reCallApi(fn, reCallTime, vm) {
  if (!fn || !vm) return false;
  fn.call(vm);
  let timer = setInterval(() => {
    fn.call(vm);
  }, reCallTime || 10 * 60 * 1000);
  vm.$once("hook:beforeDestroy", () => {
    timer && clearInterval(timer);
    timer = null;
  });
  return function () {
    timer && clearInterval(timer);
    timer = null;
  };
}

function CacheData() {
  this.cache = {};
}
CacheData.prototype.get = function(key) {
  return this.cache[key] || null;
};

CacheData.prototype.set = function(key, data) {
  this.cache[key] = {
    time: new Date().getTime(),
    data: data
  };
};

// 需要时调用 2.0版本
// 修复1.0未定时调用API, 结构调整
export function reCallAndNeedCallApi(vm, reCallTime, apiFns) {
  let timer = null;
  let timer2 = null;
  let cache = new CacheData();
  let fns = apiFns;
  let duration = reCallTime || 10 * 60 * 1000;
  let cacheKey = null;

  let core = async function (config, cache, key) {
    let { api, formatter, cb, params } = config;
    let data = api;
    if (typeof api === "function") {
      data = await api(...(params || []));
    }
    if (formatter) {
      data = formatter(data, key);
    }
    cacheKey === key && cb && cb.call(vm, data, key);
    cache.set(key, data);
  };
  vm.$once("hook:beforeDestroy", () => {
    timer && clearTimeout(timer);
    timer2 && clearInterval(timer2);
    cache = null;
    fns = null;
    duration = null;
    timer = null;
    cacheKey = null;
  });

  return function (key, refresh = false) {
    if (!fns[key] || !fns[key].api) return null;
    let { cb } = fns[key];
    let oldKey = cacheKey;
    cacheKey = key;

    if (refresh) {
      core(fns[key], cache, key);
      return;
    }

    if (oldKey === key) {
      cb && cb.call(vm, cache.get(key).data, key);
      return;
    }

    let intervalFn = () => {
      core(fns[key], cache, key);
      timer = setInterval(() => {
        core(fns[key], cache, key);
      }, duration);
    };
    let cacheData = cache.get(key);
    let now = new Date().getTime();
    timer = clearTimeout(timer);
    timer2 && clearInterval(timer2);

    if (!cacheData || (now - cacheData.time >= duration)) {
      intervalFn();
    } else {
      cb && cb.call(vm, cacheData.data, key);
      timer = setTimeout(() => {
        intervalFn();
        timer = null;
      }, now - cacheData.time);
    }
  };
}

// 根据数组中某个key的值去聚合
function statisticsForKeyCore(a, c, i, key) {
  let k = key.split(".");
  let index = 0;
  let v = c;
  while (v && index < k.length) {
    v = v[k[index]];
    index++;
  }
  if (v && v !== c) {
    if (!a.hasOwnProperty(v)) {
      a[v] = [];
    }
    a[v].push(c);
  }
  return a;
}

// 根据数组中某两个Key去生成key、value
function generateKeyValuePairCore(a, c, i, key, val) {
  let cKey = getValue(c, key);
  if (cKey) {
    a[cKey] = val || val === 0 ? getValue(c, val) : c;
  }
  return a;
}

export function statisticsForKey(key, source) {
  let res = {};
  (source || []).reduce((a, c, i) => {
    let r = statisticsForKeyCore(a, c, i, key);
    return r;
  }, res);
  return res;
}

export function generateKeyValuePair (key, val, source) {
  let res = {};
  Array.prototype.reduce.call(source || [], (a, c, i) => {
    return generateKeyValuePairCore(a, c, i, key, val);
  }, res);
  return res;
}

// reduceEveryThing
// generateKeyValuePair、statisticsForKey、sum。。。。
export function calcByReduce(operations, source) {
  let res = {};
  return res;
}
// 获取浏览路径
export function getUrl(path, url) {
  let urlString = url || window.location.href;
  let subIndex = urlString.lastIndexOf("html");
  let urlStringSub = urlString.substring(0, subIndex + 1);
  subIndex = urlStringSub.lastIndexOf("/");
  return urlStringSub.substring(0, subIndex) + path;
}

export function thousandCentimeter(num) {
  return (num || 0)
  .toString()
  .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
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

export function initVal(val) {
  return val === undefined || val === null ? "-" : val;
}

// 获取对象下某一key的值，支持深层次
export function getValue(target, key) {
  let t = target;
  let kArr = key ? key.split(".") : [];
  let i = 0;
  while (i < kArr.length && t) {
    t = t[kArr[i]];
    i++;
  }
  return t;
}

// 节流
export function throttle(fn, delay, ctx) {
  let canDo = true;
  return function(...args) {
    if (canDo) {
      fn.apply(ctx, args);
      canDo = false;
      setTimeout(function() {
        canDo = true;
      }, delay);
    }
  };
}
/**
 * 获取一段范围的日期
 * @param {*} startDayNum  开始日期相对当天的偏移天数
 * @param {*} days         取多少个日期
 * @param {*} fmt          输出日期的格式
 * @example
 * getDatePeriod(-7, 7, 'yyyy.MM.dd')
 * 输出["2020.07.11", "2020.07.12", "2020.07.13", "2020.07.14", "2020.07.15", "2020.07.16", "2020.07.17"]
 */
export function getDatePeriod(startDayNum, days, fmt = "MM.dd") {
  let dateArr = [];
  const timeStamp = Date.parse(new Date()); // 当前时间戳
  const date = new Date();
  for (let i = 0; i < days; i++) {
     date.setTime(timeStamp + (startDayNum + i) * 86400 * 1000);
    dateArr.push(formatterDate(Date.parse(date), fmt));
  }
  return dateArr;
}

const _oneHour = 60 * 60 * 1000;
const _oneDay = 24 * _oneHour;

function _returnStructure (rawData, options = {}) {
  const opts = {
    dateFmt: "MM.dd",
    isDataset: true,
    defaultValue: "-",
    formatter: null,
    ...options
  };

  const fmtTime = formatterDate(rawData, opts.dateFmt);

  if (opts.formatter) {
    return opts.formatter(fmtTime, rawData);
  } else if (opts.isDataset) {
    return [fmtTime, opts.defaultValue];
  } else {
    return { name: fmtTime, value: opts.defaultValue };
  }
}

const dayFn = {
  _getToday (options) {
    const zeroTime = new Date().setHours(0, 0, 0, 0);
    return new Array(24).fill(0).map((d, di) => {
      return _returnStructure(new Date(zeroTime + di * _oneHour), { dateFmt: "hh:00", ...(options.dataConfig || {}) });
    });
  },
  _getCurrentWeek (options) {
    const days = 7;
    const reduceDay = (new Date().getDay() || 7) - 1;
    const current = new Date().getTime() - reduceDay * _oneDay;
    return new Array(days).fill(0).map((d, di) => {
      return _returnStructure(new Date(current + di * _oneDay), options.dataConfig);
    });
  },
  _getCurrentMonth (options) {
    const nextMonth = new Date().getMonth() + 1;
    const days = new Date(new Date(new Date().setMonth(nextMonth)).setDate(0)).getDate();
    const firstDay = new Date().setDate(1);
    return new Array(days).fill(0).map((d, di) => {
      return _returnStructure(new Date(firstDay + di * _oneDay), options.dataConfig);
    });
  },
  _getCurrentYear (options) {
    return new Array(12).fill(0).map((d, i) => {
      return _returnStructure(new Date().setMonth(i, 1), { dateFmt: "MM", ...(options.dataConfig || {}) });
    });
  },
  _getRange (day, options) {
    const today = options.startTime ? new Date(options.startTime).getTime() : new Date().getTime();
    return (new Array(day).fill(0).map((d, di) => {
      return _returnStructure(new Date(today - (day - di) * _oneDay), options.dataConfig);
    }));
  },
  _getRangeWidthToday (day, options) {
    const arr = dayFn._getRange(day - 1, options);
    arr.push(_returnStructure(new Date(), options.dataConfig));
    return arr;
  }
};

/**
 * 获取一段日期 当天、本周、当月、固定天数
 * @param {*} day  当天(today)、本周(currentWeek)、当月(currentMonth)、固定天数(1~N)
 * @param {*} options 参数配置
 * @param {*} options.containToday 是否包含今天
 * @param {*} options.startTime 开始日期
 * @param {*} options.dataConfig 返回结构中单项的格式配置
 * @param {*} options.dataConfig.dateFmt 日期格式，对当天无效
 * @param {*} options.dataConfig.isDataset 是否dataset格式
 * @param {*} options.dataConfig.defaultValue 默认值
 * @param {*} options.dataConfig.formatter 返回格式自定义
 */
export function getDate (day, options = {}) {
  const specialDay = ["today", "currentMonth", "currentWeek", "currentYear"];
  let fnName = "Range";
  if (specialDay.indexOf(day) > -1) {
    fnName = day.charAt(0).toUpperCase() + day.slice(1);
    return dayFn[`_get${fnName}`](options);
  }

  if (options.containToday) {
    fnName += "WidthToday";
  }

  return dayFn[`_get${fnName}`](day, options);
}
