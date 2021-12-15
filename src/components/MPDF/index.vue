<template>
  <div class="m-pdf">
    <m-pdf-header
      v-show="ready"
      @pageChange="handleChangeForPageByOther">
    </m-pdf-header>
    <!-- :currentPage="currentPage" -->
    <component
      :is="mode"
      ref="pdf"
      :src="src"
      v-model="currentPage"
      @pdfReady="handleReadyForPage"
      @pageChange="handleChangeForPage">
    </component>
  </div>
</template>
<script>
import Emitter from "../../mixins/emitter";
import MPdfHeader from "./header";
import MPdfAside from "./aside";
import Ppt from "./ppt";
export default {
  name: "MPDF",
  data () {
    return {
      pdfDoc: null,
      ready: false,
      currentPage: 1
    };
  },
  mixins: [Emitter],
  components: {
    MPdfHeader,
    MPdfAside,
    Ppt
  },
  provide () {
    return {
      pdfView: this
    };
  },
  props: {
    src: {
      type: String,
      default: ""
    },
    // normal ppt
    mode: {
      type: String,
      default: "normal"
    },
    showAside: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleReadyForPage () {
      this.pdfDoc = this.$refs.pdf.pdfDoc;
      this.ready = true;
      this.broadcast("PdfPart", "pdf-ready");
    },
    handleChangeForPageByOther (val) {
      this.currentPage = parseInt(val);
    },
    handleChangeForPage (val) {
      this.broadcast("PdfPart", "pdf-pageChange", val);
    },
    reset() {
      this.ready = false;
      this.currentPage = 1;
      this.pdfDoc = null;
    }
  },
  mounted () {},
  beforeDestroy () {}
};
</script>
<style lang="scss" scoped>
.m-pdf {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.m-pdf__content {
  width: 100%;
  height: 100%;
  background: #525659;
}
</style>
