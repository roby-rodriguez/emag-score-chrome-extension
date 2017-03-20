import { EmagTrackerAPI } from "../../backend"
import { StorageAPI } from "../../storage"
import { I18N } from "../i18n"
import { updatePrice } from "../product"

// TODO move this to index and refactor existing
export default class Base {
    constructor(container, { selector, targetClass }) {
        try {
            this.$container = $(container)
            this._findTarget(selector)
            if (this.$target) {
                this.data = {
                    price: this._extractPrice(this.$container)
                }
                this._findTarget(selector)
                this._extractPid()
                this._extractLink()
                this._addTrackButton(targetClass)
            }
        } catch (error) {
            swal(I18N.translate('error.title'), I18N.translate('error.message', { error }), "error")
        }
    }
    _icon() {
    }
    _showLoader() {
    }
    _hideLoader() {
    }
    _extractPid() {
        throw new Error("not implemented - called base directly")
    }
    _extractPrice() {
        throw new Error("not implemented - called base directly")
    }
    _extractLink() {
        throw new Error("not implemented - called base directly")
    }
    _findTarget(selector) {
        const target = $(selector, this.$container).first()
        if (target.length)
            this.$target = target
    }
    /**
     * Adds product to local store if not already exists
     *
     * @param product tracked item data
     * @private
     */
    _addProductToLocalStore(product) {
        StorageAPI
            .getLocal(this.pid)
            .then(item => {
                if ($.isEmptyObject(item)) {
                    StorageAPI
                        .setLocal({
                            [this.pid]: product
                        })
                        .then(() => updatePrice(this.pid, product.price))
                        .catch(reason => {
                            console.warn("Could not save product to local store: " + this.pid)
                            console.warn(reason)
                        })
                }
            })
    }

    /**
     * The following actions are performed:
     *
     * > add PID to sync store
     * > track product
     * > add product to local store
     * > show sync store usage
     *
     * @param jqObj tracking button
     * @private
     */
    _trackProduct(jqObj) {
        this._showLoader.apply(jqObj)

        const pid = {
            [this.pid]: {}
        }, product = Object.assign({}, this.data, {
            pid: this.pid
        })
        StorageAPI
            .setSync(pid)
            .then(StorageAPI.getUsage)
            .then(bytesInUse =>
                EmagTrackerAPI
                    .addProduct(product)
                    .done(() => {
                        console.log("Product " + this.pid + " is now tracked:" + JSON.stringify(this.data))

                        swal(
                            I18N.translate('track.action.add.title'),
                            I18N.translate('track.action.add.message', {
                                pid: this.pid,
                                usage: Math.round(bytesInUse * 10000 / 102400) / 100
                            })
                        )
                        $(jqObj).hide()
                    })
                    .fail((xhr, status, error) => {
                        swal(I18N.translate('error.title'), I18N.translate('error.message', { error }), "error")
                        this._hideLoader.apply(jqObj)
                    })
                    .always(() => {
                        // add product to local store anyways
                        this._addProductToLocalStore(product)
                    })
            )
            .catch(reason => {
                console.log(reason)
            })
    }
    static _createButton(targetClass, titleKey, handler) {
        return $('<button/>', {
            type: "button",
            text: I18N.translate(titleKey),
            class: targetClass,
            click: e => handler(e.currentTarget)
        })
    }
    /**
     * Injects a cloned target button - clicking it finishes product scan
     * in current container
     *
     * @param targetClass css class of button to clone
     * @private
     */
    _addTrackButton(targetClass) {
        StorageAPI
            .getSync(this.pid)
            .then(item => {
                if ($.isEmptyObject(item)) {
                    const cloned = Base
                        ._createButton(targetClass, 'track.button.simple', this._trackProduct)
                        .append(this._icon())
                    cloned.insertAfter(this.$target)
                }
            })
    }
}
