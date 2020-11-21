export default {
  model: {
    event: "change",
    prop: "current"
  },
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    current: {
      default: null
    },
    customClass: {
      type: String,
      default: ""
    },
    activeStyle: { // 选中样式
      type: String,
      default: ""
    }
  },
  computed: {
    arrayMapping () {
      return (this.tabs || []).reduce((t, d, i) => {
        t[d.value] = i;
        return t;
      }, {});
    }
  }
};
