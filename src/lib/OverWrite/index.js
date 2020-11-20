/* eslint-disable */
// 排序，将其它、其他等置在末尾，并将新增的函数设置为不可枚举
function sortNoOther(fn, key = "name", includes = ["其他", "其它"]) {
  return this.sort((a, b) => {
    if (!key && key !== 0) {
      return fn(a, b);
    } else {
      let reg = new RegExp(`\\.*${includes.join("|")}\\.*`);
      let keys = key.split(".");
      let aVal = a;
      let bVal = b;
      while (keys.length > 0) {
        let first = keys.shift();
        aVal = (aVal || {})[first];
        bVal = (bVal || {})[first];
      }
      if ((reg.test(aVal) ^ reg.test(bVal)) === 1) {
        return reg.test(aVal) ? 1 : -1;
      } else {
        return fn(a, b);
      }           
    }
  });
};

Object.defineProperty(Array.prototype, "sortNoOther", {
  enumerable: false,
  value: sortNoOther
})

