export default {
  data() {
    return {
      tmpTitle: null
    };
  },
  created() {
    this.$bus.$on("iframeStatusChange", this.handleIframeStatusChange);
  },
  methods: {
    handleIframeStatusChange(data) {
      console.log("data - -------------------", data);
      if (data.status === 1 && data.data.params.title) {
        this.tmpTitle = this.title;
        this.title = data.data.params.title;
      } else if (data.status === 0 && this.tmpTitle !== null) {
        this.title = this.tmpTitle;
        this.tmpTitle = null;
      }
    }
  }
};
