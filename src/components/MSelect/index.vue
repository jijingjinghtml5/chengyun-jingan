<template>
  <z-dropdown-link ref="link">
    {{ ValKeyMapping[current] }}
    <z-dropdown-menu slot="dropdown" :popupClass="popupClass" :closeAfterClick="true">
      <z-dropdown-item v-for="f in options" :key="f.label" :isActive="f.value === current" :showCheckbox="showCheckbox" @click="handleFilterClick(f)">{{ f.label }}</z-dropdown-item>
    </z-dropdown-menu>
  </z-dropdown-link>
</template>

<script>
import ZDropdownLink from "@/components/ZDropdown/ZDropdownLink";
import ZDropdownMenu from "@/components/ZDropdown/ZDropdownMenu";
import ZDropdownItem from "@/components/ZDropdown/ZDropdownItem";
export default {
  name: "MSelect",
  components: {
    ZDropdownLink,
    ZDropdownMenu,
    ZDropdownItem
  },
  model: {
    prop: "current",
    event: "change"
  },
  props: {
    current: {
      type: [String, Number]
    },
    options: {
      type: Array,
      default: () => []
    },
    customClass: {
      type: String,
      default: ""
    },
    showCheckbox: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    popupClass() {
      let className = "popperStyle1";
      this.customClass && (className += ` ${this.customClass}`);
      return className;
    },
    ValKeyMapping() {
      return (this.options || []).reduce((r, d) => {
        r[d.value] = d.label;
        return r;
      }, {});
    }
  },
  methods: {
    handleFilterClick(item) {
      this.$emit("change", item.value);
      !this.showCheckbox && this.$refs.link.hide();
    }
  }
};
</script>
<style lang="scss" scoped>
.z-dropdown-link {
  font-size: 0.28rem;
  line-height: 0.48rem;
  min-width: 1.5rem;
  text-align: right;
}
.style1 {
  text-align: left;
  font-size: 0.24rem;
  width: 1.8rem;
  border: 0.02rem solid #2573EF;
  background-color: rgba(#2573EF, 0.4);
  padding-left: 0.1rem;
}
</style>
