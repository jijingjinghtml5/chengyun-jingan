export default {
  bind: (el, binding) => {
    el.onmousedown = (e) => {
      let lastCursor = el.style.cursor;
      el.style.cursor = "move";
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - el.offsetLeft;
      const disY = e.clientY - el.offsetTop;

      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        const l = e.clientX;
        const t = e.clientY;
        // 移动当前元素
        el.style.left = `${l - disX}px`;
        el.style.top = `${t - disY}px`;
      };

      document.onmouseup = function(e) {
        el.style.cursor = lastCursor;
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  },
  unbind: el => {
    el.onmousedown = null;
  }
};
