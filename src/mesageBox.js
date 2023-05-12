// import MsMessageBox from './components/VDialog.vue';
import { createApp, defineAsyncComponent } from 'vue';
import bus from './utils/eventBus.js'
class MessageBox {

    /**
     * @description: Hàm này dùng để hiển thị dialog
     * @param: {any} 
     * Author: AnhDV 06/05/2023
     */
    show(option) {
        let me = this;
        return new Promise((resolve) => {
            var btnConfigDefault = [
                {
                    key: 'Cancel',
                    hasBtn: false,
                    target: 'Left',
                    label: 'Cancel',
                    typeBtn: 'secondary',
                },
                {
                    key: 'Close',
                    hasBtn: false,
                    target: 'Center',
                    label: 'Close',
                    typeBtn: 'primary',
                },
                {
                    key: 'Yes',
                    hasBtn: false,
                    target: 'RightSecond',
                    label: 'Yes',
                    typeBtn: 'primary',
                    focus: true,
                },
                {
                    key: 'No',
                    hasBtn: false,
                    target: 'RightFirst',
                    label: 'No',
                    typeBtn: 'secondary',
                }

            ]
            if (option.btnConfig != null) {
                btnConfigDefault.forEach(element => {
                    element.hasBtn = false;
                    option.btnConfig.forEach(e => {
                        if (element.key == e.key) {
                            element.target = e.target;
                            element.hasBtn = true;
                            element.text = e.text ? e.text : element.text;
                            element.focus = e.focus;
                            element.typeBtn = e.typeBtn ? e.typeBtn : element.typeBtn;
                        }
                    })
                })
            }

            var optionDefault = {
                message: option.message,
                template: option.template,
                actions: option.actions,
                icon: option.icon,
                line: option.line ? true : false,
                btnConfig: btnConfigDefault,
                close: option.close,
                width: option.width,
                title: option.title,
                callback: option.callback,
            }

            let instance = me.createInstance(optionDefault);
            if (instance) {
                bus.on('btnClick', (action) => {
                    resolve(action);
                })
            }
        })
    }
    /**
     * @description: Hàm này dùng để lấy ra instance của dialog đã được mount vào container
     * @param: {any} 
     * Author: AnhDV 06/05/2023
     */
    createInstance(option) {
        let props = {
            options: option
        }, instance = this.prepareForDialog("./components/VDialog.vue", document.body, props);
        if (instance) {
            return instance;
        }
        return null;
    }
    /**
     * @description: Hàm này dùng để tạo dialog và mount vào container
     * @param: {any} 
     * Author: AnhDV 06/05/2023
     */
    prepareForDialog(component, container, props) {
        if (container && component) {
            const AsyncComp = defineAsyncComponent(() =>
                import(`${component}`)
            )
            const app = createApp(AsyncComp, {
                ...props,
                onBtnClick: (val) => {
                    app.unmount();
                    container.removeChild(app._container);
                    if (props.options.callback) {
                        props.options.callback(val);
                    }
                }
            });
            const vm = app.mount(container.appendChild(document.createElement('div')))
            return vm;
        }
        return null;
    }

    showWarning(message, title, customOptions = {}) {
        let options = {
            title: title,
            message: message,
            icon: 'warning',
            width: 400,
            btnConfig: [
                {
                    key: 'Close',
                    target: 'Center',
                    label: 'Close',
                    focus: true
                },
                {
                    key: 'Yes',
                    target: 'RightSecond',
                    label: 'Yes',
                    typeBtn: 'primary',
                },
            ],
            ...customOptions
        }
        return this.show(options);
    }

    showError(message, title, customOptions = {}) {
        let options = {
            title: title,
            message: message,
            icon: 'error',
            width: 400,
            btnConfig: [
                {
                    key: 'Close',
                    target: 'Center',
                    label: 'Close',
                    focus: true
                }
            ],
            ...customOptions
        }
        return this.show(options);
    }

    showInfo(message, title, customOptions = {}) {
        let options = {
            title: title,
            message: message,
            icon: 'info',
            width: 400,
            btnConfig: [
                {
                    key: 'Close',
                    target: 'Center',
                    label: 'Close',
                    focus: true
                }
            ],
            ...customOptions
        }
        return this.show(options);
    }

    showSuccess(message, title, customOptions = {}) {
        let options = {
            title: title,
            message: message,
            icon: 'success',
            width: 400,
            btnConfig: [
                {
                    key: 'Close',
                    target: 'Center',
                    label: 'Close',
                    focus: true
                }
            ],
            ...customOptions
        }
        return this.show(options);
    }
}

export default new MessageBox();