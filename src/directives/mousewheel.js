import { on, off } from "@/utils/dom.js";

let id = 0;
const ctx = "-_-mousewheel-_-";

function createListener(ele, options = {}) {
  let fn = () => {};
  if (ele) {
    let timer = null;
    fn = e => {
      let delta = e.wheelDelta ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
      let scrollTop = ele.scrollTop;
      let scrollDis = options.scrollDis || ele.clientHeight;
      let delay = options.delay || 200;
      let beyondDistance = ele.scrollHeight - ele.clientHeight;
      if (beyondDistance > 0 &&
          scrollTop >= 0 &&
          scrollTop <= beyondDistance &&
          ((delta > 0 && scrollTop !== 0) || (delta < 0 && scrollTop !== beyondDistance))) {
        e.preventDefault();
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
          if (delta < 0) {
            scrollTop += scrollDis;
            ele.scrollTop = Math.min(beyondDistance, scrollTop);
          } else if (delta > 0) {
            scrollTop -= scrollDis;
            ele.scrollTop = Math.max(0, scrollTop);
          }
          timer = null;
        }, delay);
      }
    };
  }
  return fn;
};

function addEventListener(ele, fn) {
  if (!ele || !fn) return false;
  on(ele, "mousewheel", fn);
  on(ele, "DOMMouseScroll", fn);
}

function removeEventListener(ele, fn) {
  if (!ele || !fn) return false;
  off(ele, "mousewheel", fn);
  off(ele, "DOMMouseScroll", fn);
}

export default {
  bind (el, binding, vnode) {
    let fn = createListener(el, binding.value);
    addEventListener(el, fn);
    el[ctx] = {
      id: id++,
      options: binding.value,
      fn: fn
    };
  },
  update (el, binding, vnode) {
    removeEventListener(el, el[ctx].fn);
    let fn = createListener(el, binding.value);
    addEventListener(el, fn);
    el[ctx].options = binding.value;
    el[ctx].fn = fn;
  },
  unbind (el, binding, vnode) {
    removeEventListener(el, el[ctx].fn);
    el[ctx] = null;
    delete el[ctx];
  }
};
