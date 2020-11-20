import { on } from "@/utils/dom.js";
let id = 0;
const elList = [];
const ctx = "-_-clickOutSide-_-";
on(document.body, "mousedown", e => {
  elList.forEach(el => {
    el[ctx].handleFn(el, e);
  });
});

function createClosureForHandlefn(vnode) {
  return function(self, current) {
    if (
      !self.contains(current.target) &&
      (!vnode ||
      !vnode.context.dropdown ||
      !vnode.context.dropdown.contains(current.target))
    ) {
      self[ctx].executeFn && self[ctx].executeFn(current);
    }
  };
}

export default {
  bind (el, binding, vnode) {
    elList.push(el);
    el[ctx] = {
      id: id++,
      executeFn: binding.value,
      handleFn: createClosureForHandlefn(vnode)
    };
  },
  update (el, binding, vnode) {
    el[ctx].executeFn = binding.value;
  },
  unbind (el, binding, vnode) {
    let findIndex = elList.findIndex(dom => dom[ctx].id === el[ctx].id);
    if (findIndex > -1) {
      elList.splice(findIndex, 1);
    }
    el[ctx] = null;
    delete el[ctx];
  }
};
