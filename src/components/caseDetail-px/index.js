import caseDetail from "./index.vue";
import dragContainer from "@/components/DragContainer";

export default {
  data() {
    return {
      caseId_: "",
      caseDefaultInfo_: null,
      caseDetailShow_: false,
      dragShow_: false,
      dragType_: "",
      dragUrl_: [],
      initialIndex_:0
    };
  },
  components: {
    caseDetail,
    dragContainer
  },
  methods: {
    handleCaseDetailClose_() {
      // console.log("关闭");
      this.caseDetailShow_ = false;
    },
    openDragContainer_(type, data) {
      this.dragType_ = type;
      this.dragUrl_ = data.url;
      this.dragShow_ = true;
      this.initialIndex_ = data.initialIndex;
    },
    openCaseDetail_(caseId, info) {
      console.log("行信息", info);
      this.caseDefaultInfo_ = info;
      this.caseId_ = caseId;
      this.caseDetailShow_ = true;
    }
  }
}
;
