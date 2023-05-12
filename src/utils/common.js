class CommonFunction {
    /**
     * @description: Convert To Base64
     * @param: {any} 
     * Author: AnhDV 10/05/2023
     */
    convertToBase64(obj) {
        if (typeof obj !== 'string') {
            obj = JSON.stringify(obj);
        }
        return Buffer.from(obj).toString('base64');
    }

    /**
     * @description: Convert From Base64
     * @param: {any} 
     * Author: AnhDV 10/05/2023
     */
    convertFromBase64(obj) {
        return Buffer.from(obj, 'base64').toString('ascii');
    }

    /**
     * @description: Tạo UUID
     * @param: {any} 
     * Author: AnhDV 10/05/2023
     */
    createUUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
            function (c) {
                var r = (dt + Math.random() * 16) % 16 | 0;
                dt = Math.floor(dt / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
            });
        return uuid;
    }

    /**
     * @description: Focus vào control có class là className
     * @param: {any} 
     * Author: AnhDV 10/05/2023
     */
    focusErrorControl(scope, className) {
        let control = scope.querySelector(`.${className}`);
        if (control) {
            control.focus();
            control.select();
        }
    }

    /**
     * @description: Tự động focus vào control nhập liệu đầu tiên theo scope truyền vào
     * @param: {any} 
     * Author: AnhDV 10/05/2023
     */
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
                    input = me.getFirstControlFocus(scope);
                }
                if (input) {
                    input.focus();
                }
            });
        }
    }


    /**
     * @description:  Lấy control nhập liệu đầu tiên 
     * @param: {any} 
     * Author: AnhDV 10/05/2023
     */
    getFirstControlFocus(parent) {
        const
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
    }

    /**
     * @description: Kiểm tra elemnt có đang hiển thị hay không
     * @param: {any} 
     * Author: AnhDV 11/05/2023
     */
    isElementVisible(el) {
        return el.offsetParent;
    }

    /**
     * @description: Xử lý focus control cuối cùng thì sẽ thực thi hàm fn
     * @param: {any} 
     * Author: AnhDV 11/05/2023
     */
    processUnfocusLastControl(e, fn) {
        if (e.which === 13 && e.target == document.activeElement) return;
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
    }


    /**
     * @description: Hàm này dùng để xử lý xss
     * @param: {any} 
     * Author: AnhDV 11/05/2023
     */
    escapeHtml(unsafe) {
        if (unsafe) {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        }
        return unsafe;
    }
}