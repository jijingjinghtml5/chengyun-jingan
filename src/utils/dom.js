export const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler, useCapture) {
      if (element && event && handler) {
        element.addEventListener(event, handler, useCapture || false);
      }
    };
  } else {
    return function(element, event, handler, useCapture) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler, useCapture || false);
      }
    };
  }
})();

export const off = (function() {
  if (document.removeEventListener) {
    return function(element, event, handler, useCapture) {
      if (element && event) {
        element.removeEventListener(event, handler, useCapture || false);
      }
    };
  } else {
    return function(element, event, handler, useCapture) {
      if (element && event) {
        element.detachEvent("on" + event, handler, useCapture || false);
      }
    };
  }
})();

export const once = (function(element, event, fn) {
  var listener = function() {
    if (fn) {
      fn.apply(this, arguments);
    }
    off(element, event, listener);
  };
  on(element, event, listener);
})();

export function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(" ") !== -1) throw new Error("className should not contain space.");
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (" " + el.className + " ").indexOf(" " + cls + " ") > -1;
  }
}

export function addClass(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || "").split(" ");

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += " " + clsName;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

/* istanbul ignore next */
export function removeClass(el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(" ");
  var curClass = " " + el.className + " ";

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(" " + clsName + " ", " ");
    }
  }
  if (!el.classList) {
    el.className = curClass.replace(/^\s+|\s+$/, "");
  }
};

export function getBoundingClientRect(ele, relative) {
  let rect = ele.getBoundingClientRect();
  let scrollTop = 0;
  let scrollLeft = 0;
  scrollTop = window.pageYOffset;
  scrollLeft = window.pageXOffset;
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top,
    docTop: rect.top + scrollTop,
    docLeft: rect.left + scrollLeft
  };
}

export function getBoundingClientRectForParent(ele, relative) {
  let relativeDom = relative || ele.ownerDocument.documentElement;
  let relativeDomRect = relativeDom.getBoundingClientRect();
  let rect = ele.getBoundingClientRect();
  let scrollTop = 0;
  let scrollLeft = 0;
  if (relative) {
    scrollTop = relativeDom.scrollTop;
    scrollLeft = relativeDom.scrollLeft;
  } else {
    scrollTop = window.pageYOffset;
    scrollLeft = window.pageXOffset;
  }
  return {
    top: Math.round(rect.top),
    left: Math.round(rect.left),
    right: Math.round(rect.right),
    bottom: Math.round(rect.bottom),
    width: rect.right - rect.left,
    height: rect.bottom - rect.top,
    docTop: ele !== relativeDom ? Math.round(rect.top + scrollTop - relativeDomRect.top) : 0,
    docLeft: ele !== relativeDom ? Math.round(rect.left + scrollLeft - relativeDomRect.left) : 0
  };
}

export function getStyleComputedProperty(element, property) {
  // document.defaultView(firefox 3.6) 或 window
  var css = document.defaultView.getComputedStyle(element, null);
  return property ? css[property] : css;
}

export function findScrollParent(e) {
  if (!e) return null;
  let parent = e.parentNode;
  while (parent && parent !== document.body && parent !== document.documentElement) {
    let styles = getStyleComputedProperty(parent);
    if (
      ["scroll", "auto"].indexOf(styles["overflow"]) !== -1 ||
      ["scroll", "auto"].indexOf(styles["overflow-x"]) !== -1 ||
      ["scroll", "auto"].indexOf(styles["overflow-y"]) !== -1
    ) {
      break;
    } else {
      parent = parent.parentNode;
    }
  }
  return parent;
}

export function checkSupportCssProperties(properties = []) {
  const root = document.documentElement;
  let htmlProperty = getStyleComputedProperty(root);
  let supportProperties = properties.filter(d => htmlProperty.hasOwnProperty(d));
  supportProperties.forEach(prop => {
    const className = `support${prop.charAt(0).toUpperCase() + prop.slice(1)}`;
    if (!hasClass(root, className)) {
      addClass(root, className);
    }
  });
}
