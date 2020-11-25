import { Button, ButtonGroup, Select, Option, Form, FormItem, Input, InputNumber, DatePicker, TimePicker, Dropdown, DropdownMenu, DropdownItem, Tooltip, Loading, Message } from "element-ui";
const components = [Button, ButtonGroup, Select, Option, Form, FormItem, Input, InputNumber, DatePicker, TimePicker, Dropdown, DropdownMenu, DropdownItem, Tooltip, Loading];
export default {
  install (Vue) {
    Vue.prototype.$message = Message;
    components.forEach(component => {
      Vue.use(component);
    });
  }
};
