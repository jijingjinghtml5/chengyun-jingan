export function TimingTrigger (interval) {
  this.fns = [];
  this.interval = interval || window.$config.apiInterval || 10 * 60 * 1000;
  setInterval(() => {
    this.fns.forEach(fn => {
      fn();
    });
  }, this.interval);
}

TimingTrigger.prototype.register = function (callback, vm, immediate = true) {
  if (!callback) return;
  if (this.fns.indexOf(callback) === -1) {
    this.fns.push(callback);
    immediate && callback();
    vm && vm.$on("hook:beforeDestroy", () => {
      this.unregister(callback);
    });
  }
};

TimingTrigger.prototype.unregister = function (callback) {
  const index = this.fns.indexOf(callback);
  index !== -1 && (this.fns.splice(index, 1));
};

export default {
  install (Vue, options) {
    Vue.prototype.$timer = new TimingTrigger(options);
  }
};
