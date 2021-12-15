<template>
  <div class="m-pdf__header-container" @mouseenter="handleOpenForHeader" @mouseleave="handleCloseForHeader">
    <div class="m-pdf__header" :class="{ show: headerShow }">
      <div class="m-pdf__header-name text-ellipsis">{{ pdfName }}</div>
      <div class="m-pdf__header-page">
        <input v-model.lazy="currentPage" type="text" @change="handleChangeForInput($event)">
        / {{ numPages }}
      </div>
      <div class="m-pdf__header-btnGroup">
        <span class="download">
          <a :href="pdfSrc" download="">
            <img src="./images/download.png" alt="">
          </a>
        </span>
        <!-- <span class="print">
          <img src="./images/print.png" alt="">
        </span> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "MPdfHeader",
  componentName: "PdfPart",
  data () {
    return {
      pdfDoc: null,
      pdfSrc: "",
      pdfName: "",
      currentPage: "-",
      numPages: "-",
      headerTimer: null,
      headerShow: false
    };
  },
  inject: ["pdfView"],
  methods: {
    init () {
      this.currentPage = 1;
      this.pdfDoc = this.pdfView.pdfDoc;
      this.pdfSrc = this.pdfDoc._transport._params.url;
      this.pdfName = this.getPdfName(this.pdfView.src);
      this.numPages = this.pdfDoc.numPages;
    },
    getPdfName (src) {
      let res = "";
      if (src) {
        const reg = new RegExp(/[^/]+\.pdf/gi);
        const matchArr = src.match(reg);
        res = decodeURIComponent(matchArr[0] || "");
      }
      return res;
    },
    handleOpenForHeader () {
      clearTimeout(this.headerTimer);
      this.headerShow = true;
    },
    handleCloseForHeader () {
      setTimeout(() => {
        this.headerShow = false;
      }, 10000);
    },
    handleChangeForInput (e) {
      const value = (e.target || e.srcElement).value;
      if (/-?\d+/g.test(value) && value > 0 && value <= this.numPages) {
        this.$emit("pageChange", value);
      } else {
        this.currentPage = value;
      }
    }
  },
  created () {
    this.$on("pdf-ready", this.init);
    this.$on("pdf-pageChange", val => {
      this.currentPage = val;
    });
  },
  mounted () {}
};
</script>
<style lang="scss" scoped>
.m-pdf__header-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 5%;
  z-index: 1;
}
.m-pdf__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.4rem;
  height: 1rem;
  font-size: 0.28rem;
  line-height: 1;
  color: #fff;
  background: #323639;
  transform: translateY(-100%);
  transition: transform 0.3s linear;
  &.show {
    transform: translateY(0);
  }
}
.m-pdf__header-name,
.m-pdf__header-btnGroup {
  width: 0;
  flex: 1;
}
.m-pdf__header-name {
  font-size: 0.32rem;
  line-height: 1;
  color: #fff;
  font-weight: 500;
}
.m-pdf__header-btnGroup {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 0;
  span {
    cursor: pointer;
  }
  img {
    width: 0.48rem;
  }
}
.m-pdf__header-page {
  input {
    width: 0.8rem;
    border: 0;
    outline: 0;
    background: #191B1C;
    color: inherit;
    text-align: right;
  }
}
</style>
