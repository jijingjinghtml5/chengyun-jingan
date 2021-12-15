import { on, off } from '../utils/dom.js'
import { throttle } from '..//utils/tools'
let id = 0
const ctx = Symbol('mousewheel')
const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1
const eventName = isFirefox ? 'DOMMouseScroll' : 'mousewheel'

function createListener (ele, callBack) {
  let fn = () => {}
  if (ele) {
    fn = e => {
      const delta = e.wheelDelta ? e.wheelDelta / 120 : -(e.detail || 0) / 3
      e.delta = delta
      callBack && callBack.call(this, e)
    }
  }
  return throttle(fn)
};

function addEventListener (ele, fn) {
  if (!ele || !fn) return false
  on(ele, eventName, fn)
}

function removeEventListener (ele, fn) {
  if (!ele || !fn) return false
  off(ele, eventName, fn)
}

export default {
  bind (el, binding, vnode) {
    const fn = createListener(el, binding.value)
    addEventListener(el, fn)
    el[ctx] = {
      id: id++,
      fn: fn
    }
  },
  update (el, binding, vnode) {
    removeEventListener(el, el[ctx].fn)
    const fn = createListener(el, binding.value)
    addEventListener(el, fn)
    el[ctx].fn = fn
  },
  unbind (el, binding, vnode) {
    removeEventListener(el, el[ctx].fn)
    el[ctx] = null
    delete el[ctx]
  }
}
