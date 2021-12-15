<template>
  <div class="m-pdf__content" ref="container" @click="nextPage" v-mousewheel="handleChangeForMouseWheel">
    <canvas ref="canvas"></canvas>
  </div>
</template>
<script>
import mousewheel from "../../directives/mousewheel2";
const PDFJS = require("pdfjs-dist");
PDFJS.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");
export default {
  name: "ModePpt",
  data () {
    return {
      pdfDoc: null,
      ready: false,
      pdfRender: null
    };
  },
  inheritAttrs: false,
  directives: {
    mousewheel
  },
  model: {
    prop: "currentPage",
    event: "pageChange"
  },
  props: {
    src: {
      type: String,
      default: ""
    },
    currentPage: {
      type: Number,
      defualt: -1
    }
  },
  computed: {
    ctx () {
      const dom = this.$refs.canvas;
      return dom ? dom.getContext("2d") : null;
    }
  },
  watch: {
    currentPage: {
      handler (nv) {
        this.renderPage(nv);
      }
    },
    src: {
      handler() {
        this.init();
      }
    }
  },
  methods: {
    init () {
      if (!this.src) return false;
      this.ready = false;
      if (this.pdfDoc) {
        this.pdfDoc.cleanup();
        this.pdfDoc.destroy();
        this.$emit("pageChange", 1);
        this.pdfDoc = null;
      }
      PDFJS.getDocument(this.src).promise.then(pdfDoc => {
        this.pdfDoc = Object.freeze(pdfDoc);
        this.ready = true;
        this.renderPage(this.currentPage);
        this.$emit("pdfReady");
      }).catch(error => {
        console.log("pdf error", error);
      });
    },
    renderPage (currentPage) {
      if (!this.pdfDoc | !this.ctx) return false;
      // if (currentPage === this.currentPage) return false;
      if (currentPage <= this.pdfDoc.numPages) {
        this.pdfDoc.getPage(parseInt(currentPage)).then(page => {
          if (this.pdfRender !== null) {
            this.pdfRender.cancel();
          }
          const wrapInfo = this.$refs.container.getBoundingClientRect();
          const pageInfo = {
            width: page.view[2],
            height: page.view[3]
          };
          let ratio = 1;
          if (pageInfo.width / pageInfo.height > wrapInfo.width / wrapInfo.height) {
            ratio = wrapInfo.width / pageInfo.width;
          } else {
            ratio = wrapInfo.height / pageInfo.height;
          }
          const viewport = page.getViewport({ scale: ratio });
          this.$refs.canvas.height = viewport.height;
          this.$refs.canvas.width = viewport.width;
          this.pdfRender = page.render({
            canvasContext: this.$refs.canvas.getContext("2d"),
            viewport: viewport
          });
          this.pdfRender.promise.then(() => {
            this.pdfRender = null;
          }).catch(() => {
            this.pdfRender = null;
          });
        });
      }
    },
    handleChangeForMouseWheel (e) {
      // -1 下 1 上
      this.updatePage(this.currentPage - e.delta);
    },
    nextPage () {
      this.updatePage(this.currentPage + 1);
    },
    updatePage (page) {
      if (page > 0 && page <= this.pdfDoc.numPages) {
        this.$emit("pageChange", page);
        this.renderPage(page);
      }
    }
  },
  mounted () {
    this.init();
  },
  beforeDestroy () {
    this.pdfDoc && this.pdfDoc.destroy();
  }
};
</script>
<style lang="scss" scoped>
.m-pdf__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
