<template>
  <div
    class="v-dragable-element"
    @touchstart.stop="dragMouseDown"
    @touchend.stop="closeDragElement"
    @mousedown.stop="dragMouseDown"
    @mouseup.stop="closeDragElement"
    @touchmove.stop="iosMove">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "VDragableElement",
  props: {
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    parentWidth: {
      type: Number,
      default: 0,
    },
    parentHeight: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      shiftX: 0,
      shiftY: 0,
      left: 0,
      top: 0,
      elem: null,
      isIos: false,
      parent: {
        width: 0,
        height: 0,
      },
    };
  },
  watch: {
    width(newWidth, oldWidth) {
      const me = this;
      if (newWidth < oldWidth) return;
      if (me.left === 0) return;
      me.parent.width = me.parentWidth || me.elem.parentNode.offsetWidth;
      me.parent.height = me.parentHeight || me.elem.parentNode.offsetHeight;
      if (newWidth > me.parent.width - me.left) {
        const newLeft = me.parent.width - newWidth;
        me.left = newLeft < 0 ? 0 : newLeft;
        me.elem.style.left = `${me.left}px`;
      }
    },
    height(newHeight, oldHeight) {
      const me = this;
      if (newHeight < oldHeight) return;
      if (me.top === 0) return;
      me.parent.width = me.parentWidth || me.elem.parentNode.offsetWidth;
      me.parent.height = me.parentHeight || me.elem.parentNode.offsetHeight;
      if (newHeight > me.parent.height - me.top) {
        const newTop = me.parent.height - me.height;
        me.top = newTop;
        me.elem.style.top = `${me.top}px`;
      }
    },
  },
  methods: {
    /**
     * @description: Kiểm tra xem element có được kéo thả hay khong
     * @param: {any}
     * @return: {any}
     * Author: AnhDV 06/05/2023
     */
    canDrag(element) {
      const me = this;
      if (element == me.elem) return true;
      // nếu thẻ html có thuộc tính draggable = false thì không cho kéo thả
      if (element.attributes && element.attributes.draggable && element.attributes.draggable.value == "false")
        return false;
      return me.canDrag(element.parentElement);
    },

    /**
     * @description: nếu là ios thì sử dụng touchmove
     * @param: {any}
     * Author: AnhDV 06/05/2023
     */
    iosMove(e) {
      const me = this;
      if (!me.isIos) return;
      me.elementDrag(e);
    },

    /**
     * @description: Khi kéo thả element
     * @param: {any}
     * Author: AnhDV 06/05/2023
     */
    elementDrag(e) {
      const me = this;
      me.$emit("dragging");
      e.preventDefault();
      if (!e.pageX) {
        document.body.style.overflow = "hidden";
      }
      const x = e.pageX || e.changedTouches[0].pageX;
      const y = e.pageY || e.changedTouches[0].pageY;
      let newLeft = x - me.shiftX;
      let newTop = y - me.shiftY;
      const newRight = x - me.shiftX + me.elem.offsetWidth;
      const newBottom = y - me.shiftY + me.elem.offsetHeight;
      if (newLeft < 0) {
        newLeft = 0;
      } else if (newRight > me.parent.width) {
        newLeft = me.parent.width - me.elem.offsetWidth;
      } else {
        newLeft = x - me.shiftX;
      }

      if (newTop < 0) {
        newTop = 0;
      } else if (newBottom > me.parent.height) {
        newTop = me.parent.height - me.elem.offsetHeight;
      } else {
        newTop = y - me.shiftY;
      }
      me.elem.style.left = `${newLeft}px`;
      me.left = newLeft;
      me.elem.style.top = `${newTop}px`;
      me.top = newTop;
    },
    /**
     * @description: là thời điểm nhấn chuột hoặc chạm vào element để kéo thả
     * @param: {any}
     * Author: AnhDV 06/05/2023
     */
    dragMouseDown(e) {
      const me = this;
      if (!me.canDrag(e.target)) return;
      if (e.target.closest("span")) return;
      me.$emit("activated");
      me.parent.width = me.parentWidth || me.elem.parentNode.offsetWidth;
      me.parent.height = me.parentHeight || me.elem.parentNode.offsetHeight;
      me.shiftX = e.pageX ? e.pageX - me.elem.offsetLeft : e.changedTouches[0].pageX - me.elem.offsetLeft;
      me.shiftY = e.pageY ? e.pageY - me.elem.offsetTop : e.changedTouches[0].pageY - me.elem.offsetTop;
      if (e.pageX) {
        if (me.isIos) {
          me.elem.addEventListener("touchmove", me.elementDrag);
        } else {
          me.elem.addEventListener("mousemove", me.elementDrag);
          me.elem.addEventListener("mouseleave", me.closeDragElement);
        }
      } else {
        me.elem.addEventListener("touchmove", me.elementDrag);
      }
    },
    /**
     * @description: là thời điểm nhả chuột hoặc chạm vào element để kéo thả
     * @param: {any}
     * Author: AnhDV 06/05/2023
     */
    closeDragElement() {
      const me = this;
      me.$emit("dropped");
      document.body.style.overflow = null;
      me.elem.removeEventListener("mousemove", me.elementDrag, false);
      me.elem.removeEventListener("touchmove", me.elementDrag, false);
      me.elem.onmouseup = null;
      me.elem.ontouchend = null;
    },
  },
  /**
   * @description:
   * @param: {any}
   * Author: AnhDV 06/05/2023
   */
  mounted() {
    const me = this;
    me.isIos = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
    me.elem = me.$el;
  },
};
</script>

<style>
.v-dragable-element {
  position: absolute;
  z-index: 100;
  cursor: move;
}
</style>
