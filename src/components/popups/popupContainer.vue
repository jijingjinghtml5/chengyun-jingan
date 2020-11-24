<template>
  <div class="popupContainer" id="popupContainer" v-if="popupBool">
    <popup
      v-for="(popup, index) in popups"
      :key="`${popup.componentName}_${index}`"
      v-bind="popup"
      v-on="$listeners"
      @close="handleClickForClosePopup(index, ...arguments)"
      @addNewPopup="handleClickForAddNewPopup">
    </popup>
  </div>
</template>
<script>
import Popup from "./popup";
export default {
  name: "popupContainer",
  components: { Popup },
  data() {
    return {
      popups: []
    };
  },
  inheritAttrs: false,
  props: {
    popupBool: {
      type: Boolean,
      default: false
    },
    stylePopup: {
      type: Object,
      default: () => {
        return {
         left: "10px",
         top: "200px"
        };
      }
    },
    mapData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    componentName: {
      type: String,
      default: null
    }
  },
  mounted() {},
  computed: {
    item() {
      return {
        stylePopup: this.stylePopup,
        componentName: this.componentName,
        mapData: this.mapData
      };
    }
  },
  watch: {
    item: {
      handler() {
        if (this.componentName) {
          this.popups = [this.item];
        }
      }
    },
    popupBool: {
      handler() {
        if (!this.popupBool) {
          this.popups = [];
        }
      }
    }
  },
  methods: {
    handleClickForAddNewPopup(options = {}) {
      let findIndex = this.popups.findIndex(popup => options.key && options.key === popup.key);
      let newPopup = {
        ...options
      };
      if (findIndex === -1) {
        this.popups.push(newPopup);
      } else {
        this.popups.splice(findIndex, 1, newPopup);
      }
    },
    handleClickForClosePopup(index) {
      this.popups.splice(index);
      if (index === 0) {
        this.$emit("closePopup");
        this.$emit("update:popupBool", false);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.popupContainer {
  position: absolute;
  top: 0;
  left: 0;
  // width: 100%;
  // height: 100%;
  z-index:9999;
  // pointer-events: none;
}
</style>
