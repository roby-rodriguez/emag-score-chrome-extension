import { EmagTrackerAPI } from "../../backend"
import { StorageAPI } from "../../storage"
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
        } catch (e) {
            swal("Oops...", "Something went wrong! (DOM structure change)\n\n" + e, "error")
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
                        swal("Added", "Product " + this.pid + " is now tracked!"
                            + "\n\nSpace usage: " + Math.round(bytesInUse * 10000 / 102400) / 100 + "%", "success")
                        $(jqObj).hide()
                    })
                    .fail((xhr, status, error) => {
                        swal("Oops...", "Something went wrong!\n\n" + JSON.stringify({
                                xhr: xhr, status: status,
                                error: error
                            }), "error")
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
    static _createButton(targetClass, handler) {
        return $('<button/>', {
            type: "button",
            text: "track price", // urmareste pret
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
                        ._createButton(targetClass, this._trackProduct)
                        .append(this._icon())
                    cloned.insertAfter(this.$target)
                }
            })
    }
}
