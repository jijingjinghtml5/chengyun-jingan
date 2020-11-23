import { isSupportRaf, requestAnimationFrame, cancelAnimationFrame } from "@/utils/";
export default {
  data () {
    return {
      // 滚动、动画
      timer: null,
      // timer2: null,
      timer3: null,
      canScoll: false,
      pointerIn: false,
      animationId: null
    };
  },
  props: {
    isVirtual: {
      type: Boolean,
      default: false
    },
    stop: {
      type: Boolean,
      default: false
    },
    dataset: {
      defualt: null
    },
    interval: {
      type: Number,
      default: 2000
    },
    stopInterval: {
      type: Number,
      default: 2000
    },
    distance: {
      type: [String, Number],
      default: "page"
    }
  },
  watch: {
    dataset: {
      handler () {
        this.$nextTick(() => {
          this.closeLoop();
          this.init();
        });
      }
    },
    stop: {
      handler (nv) {
        if (nv) {
          this.closeLoop();
        } else {
          this.startLoop();
        }
      }
    },
    isVirtual: {
      handler () {
        this.$nextTick(() => {
          this.closeLoop();
          this.init();
        });
      }
    }
  },
  methods: {
    init () {
      this.wrap = this.isVirtual ? this.$children && this.$children.length ? this.$children[0].$el : null : this.$el;
      if (!this.wrap) return;
      this.canScoll = false;
      this.wrap.scrollTop = 0;
      // console.log(this.wrap, this.wrap.scrollHeight, this.wrap.offsetHeight);
      if (this.wrap.scrollHeight > this.wrap.offsetHeight) {
        this.canScoll = true;
        this.startLoop();
      }
    },
    startLoop () {
      if (!this.canScoll || this.stop || this.pointerIn) return false;
      this.timer = setInterval(() => {
        this.scrollTo();
      }, this.interval + this.stopInterval);
    },
    closeLoop () {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }

      if (this.timer3) {
        clearTimeout(this.timer3);
        this.timer3 = null;
      }

      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    },
    scrollTo () {
      const distance = isNaN(+this.distance) ? this.wrap.offsetHeight : +this.distance;
      const interval = this.interval;
      const finalDistance = Math.min(this.wrap.scrollTop + distance, this.wrap.scrollHeight - this.wrap.offsetHeight);
      let timestamp = new Date().getTime();
      const step = () => {
        const now = new Date().getTime();
        const timeDiff = now - timestamp;
        timestamp = now;
        const disEveryStep = Math.ceil(timeDiff * distance / interval);
        this.wrap.scrollTop += disEveryStep;
        if (this.wrap.scrollTop < finalDistance) {
          this.animationId = requestAnimationFrame(step);
        } else {
          if (finalDistance >= this.wrap.scrollHeight - this.wrap.offsetHeight) {
            this.timer3 = setTimeout(() => {
              this.wrap.scrollTop = 0;
            }, this.stopInterval / 2);
          }
        }
      };
      requestAnimationFrame(step);
    },
    handleMouseEnter () {
      this.pointerIn = true;
      this.closeLoop();
    },
    handleMouseLeave () {
      this.pointerIn = false;
      this.startLoop();
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.init();
    // });
    setTimeout(() => {
      this.init();
    }, 0);
    if (!isSupportRaf) {
      const _this = this;
      const focus = function () {
        _this.closeLoop();
        _this.startLoop();
      };
      const blur = function () {
        _this.closeLoop();
      };
      window.addEventListener("focus", focus);
      window.addEventListener("blur", blur);
      this.$once("hook:beforeDestroy", () => {
        window.removeEventListener("focus", focus);
        window.removeEventListener("blur", blur);
      });
    }
  },
  beforeDestroy () {
    this.closeLoop();
  }
};
