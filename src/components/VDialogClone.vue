<template>
  <div class="dialog">
    <div class="dialog__overlay"></div>
    <div class="dialog__main">
      <DragElement>
        <div class="dialog__content" :style="{ width: options.width || width, minWidth: options.minWidth || width }">
          <div class="content">
            <div class="icon-message" v-if="options.icon" :class="contentHeight > 0 ? 'icon-message--has-height' : ''">
              <div class="icon icon-48" :class="options.icon"></div>
            </div>
            <div class="message-content">
              <div class="title" v-if="options.title">{{ options.title }}</div>
              <template v-if="options.message">
                <div class="message" v-if="isHtml" v-html="options.message"></div>
                <div class="message" v-else>{{ options.message }}</div>
              </template>
            </div>
            <div class="mess-line" v-if="options.line"></div>
            <div class="message-footer" v-if="showButton" v-on:keydown="footerKeydown">
              <div class="btn-group">
                <div v-for="(btn, index) in listBtn">
                  <button
                    :key="index"
                    class="btn btn--primary"
                    @click="btnClick(btn.key)"
                    :ref="btn.focus ? 'btnFocus' : 'btnOther'"
                    :class="btn.class"
                    :style="btn.style">
                    {{ btn.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DragElement>
    </div>
  </div>
</template>

<script>
import bus from "../utils/eventBus.js";
import DragElement from "./VDragableElement.vue";
export default {
  name: "VDialog",
  components: {
    DragElement,
  },
  props: {
    width: {
      type: String,
      default: "444px",
    },
    options: {
      // cấu hình cho dialog
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    let showButton = false;
    if (this.options.btnConfig && this.options.btnConfig.length > 0) {
      for (let i = 0; i < this.options.btnConfig.length; i++) {
        if (this.options.btnConfig[i].hasBtn) {
          showButton = true;
          break;
        }
      }
    }
    return {
      list: [{ name: "John 1", id: 0 }],
      dragging: false,
      isShowMessage: true,
      message: "",
      showButton: showButton,
      contentHeight: 0,
      isHtml: true,
      btnClickKey: "",
    };
  },
  computed: {
    listBtn() {
      return this.options.btnConfig.filter((item) => item.hasBtn);
    },
  },
  methods: {
    log: function (evt) {
      window.console.log(evt);
    },
    btnClick(key, isClose = true) {
      let me = this;
      if (isClose) {
        me.btnClickKey = key;
        me.hideMessageBox();
        bus.emit("btnClick", key);
        me.$emit("btnClick", key);
      }
    },

    hideMessageBox() {
      let me = this;
      me.isShowMessage = false;
      me.$nextTick(() => {
        me.$el.remove();
      });
    },

    escapeContent(htmlContent) {
      return htmlContent.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    },

    processUnfocusLastControl(e, fn) {
      if (e.which === 9 && !e.shiftKey) {
        let cur = e.target;
        let els = e.currentTarget.querySelectorAll("*");
        var flag = true;
        for (let i = 0; i < els.length; i++) {
          if (els[i] === cur) {
            flag = false;
            continue;
          }
          if (flag) {
            continue;
          }
          els[i].focus();
          if (els[i] === document.activeElement) {
            e.preventDefault();
            return;
          }
        }
      }
      e.preventDefault();
      fn();
    },

    getFirstControlFocus(parent) {
      const me = this,
        obj = parent || document,
        selector = [
          'input:not([disabled]):not([tabindex="-1"])',
          'select:not([disabled]):not([tabindex="-1"])',
          'textarea:not([disabled]):not([tabindex="-1"])',
          'button:not([disabled]):not([tabindex="-1"])',
          'a:not([disabled]):not([tabindex="-1"])',
        ].join(", ");

      const items = obj.querySelectorAll(selector);
      if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].offsetParent !== null) {
            items[i].focus();
            return items[i];
          }
        }
      }
    },

    focusFirstControl(scope) {
      if (scope) {
        const me = this;
        me.$nextTick(() => {
          let input;
          if (
            scope.type === "text" ||
            (scope.hasAttribute && scope.hasAttribute("type") && scope.getAttribute("type") === "text")
          ) {
            input = scope;
          } else {
            input = this.getFirstControlFocus(scope);
          }
          if (input) {
            input.focus();
          }
        });
      }
    },

    footerKeydown(e) {
      const me = this;
      this.processUnfocusLastControl(e, () => {
        me.focusFirstControl(me.$el);
      });
    },

    setActionsEvent() {
      const me = this;
      if (me.options && me.options.actions && me.options.actions.length > 0) {
        me.options.actions.forEach((action) => {
          let element = me.$el.querySelector(action.elementSelector);
          if (element) {
            element.addEventListener(action.event || "click", (e) => action.method(me));
          }
        });
      }
    },

    removeActionsEvent() {
      const me = this;
      bus.off("btnClick");
      if (me.options && me.options.actions && me.options.actions.length > 0) {
        me.options.actions.forEach((action) => {
          let element = me.$el.querySelector(action.elementSelector);
          if (element) {
            element.removeEventListener(action.event || "click", (e) => action.method);
          }
        });
      }
    },
  },
  mounted() {
    const me = this;

    if (me.options.message && me.options.message.length > 0) {
      // nếu truyền html thì để thế, còn truyền tẽ thì chuyển lại thành ký tự đặc biệt để nó không bị biến thành html khi hiển thị
      if (/<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?|<([a-z]+).*?<\/\1>/i.test(me.options.message)) {
        me.isHtml = true;
      } else {
        me.isHtml = false;
      }
    }

    if (me.options && me.options.actions && me.options.actions.length > 0) {
      me.setActionsEvent();
    }

    me.$nextTick(() => {
      if (me.$refs.btnFocus && me.$refs.btnFocus.length > 0) {
        me.$refs.btnFocus[0].focus();
      } else {
        me.focusFirstControl(me.$el);
      }
      let contentElement = me.$el.querySelector(".message-content");
      if (contentElement) {
        me.contentHeight = contentElement.offsetHeight;
      } else {
        me.contentHeight = 0;
      }
    });
  },
  unmounted() {
    const me = this;
    me.removeActionsEvent();
  },
};
</script>

<style>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20000;
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease;
}

.dialog__main {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 1002;
  transition: all 0.25 ease;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: white; */
}

.dialog__overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}

.dialog__content {
  background-color: white;
}

.dialog__header {
  position: relative;
  padding: 10px 20px;
  border-bottom: 1px solid #e5e5e5;
}

.dialog__title {
  font-size: 20px;
  font-weight: 600;
}

.dialog__close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  cursor: pointer;
}
</style>
