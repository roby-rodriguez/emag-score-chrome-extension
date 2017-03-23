import { EmagTrackerAPI } from "../../backend"
import { StorageAPI } from "../../storage"
import { I18N } from "../i18n"
import { track } from "../product"
import { toArray } from "../../utils"

/**
 * Base class for scanners
 *
 * Properties:
 *
 * > data: array of identified products
 * > $container: the main container where the additional track button is added
 * > $target: the button that will be "cloned"
 * > $source: the cloned "track-product" button
 * > $found: a promise object that can be used externally to check if pid already added to sync
 * > loaderClass: css when $source clicked
 * > *sourceClass: css of $source
 *
 * Methods:
 *
 * > constructor: if a selector is given the will be a target lookup, otherwise products must be specified
 * > extract*: extract various product-related data
 * > trackProductDone: housekeeping callback when adding product is successful
 * > trackProduct: called when clicking the track button (source)
 * > icon: custom html/css for track button
 * > show/hide-Loader: html/css for enabling the track button
 */
export default class Base {

    constructor(container, { selector, products, sourceClass, sourceTitle=I18N.translate('track.button.simple'),
            loaderClass="loading-grid", loaderPadding=35 }) {

        this.sourceClass = sourceClass
        this.sourceTitle = sourceTitle
        this.loaderClass = loaderClass
        this.loaderPadding = loaderPadding
        this.$container = $(container)
        if (products && products.length) {
            this.data = products
            this._addTrackButton()
        } else {
            this._findTarget(selector)
            if (this.$target) {
                this.data = {
                    price: this._extractPrice(this.$container)
                }
                this._extractPid()
                this._extractLink()
                this._addTrackButton()
            }
        }
    }

    _icon() {
        return $('<div/>', {
            class: "emg-btn-icon"
        }).append(
            $('<i/>', {
                class: "icon-i52-list-add"
            })
        )
    }

    _showLoader() {
        this.$source.empty()
        this.$source.css("padding-left", "10px")
        this.$source.append($('<img/>', {
            src: chrome.extension.getURL("res/images/ajax-loader.gif"),
            class: this.loaderClass
        }))
    }

    _hideLoader() {
        this.$source.text(this.sourceTitle)
        this.$source.css("padding-left", this.loaderPadding + "px")
        this.$source.append(this._icon())
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

    _trackProductDone() {
        this.$source.hide()
    }

    _trackProduct() {
        this._showLoader()

        track(toArray(this.data))
            .then(({ problems, pids, bytesInUse }) => {
                if (problems.length) {
                    swal(I18N.translate('error.title'), I18N.translate('error.message', { error: problems }), "error")
                    this._hideLoader()
                } else {
                    console.log("Product(s) " + pids + " are now tracked:" + JSON.stringify(this.data))

                    swal(
                        I18N.translate('track.action.add.title'),
                        I18N.translate('track.action.add.message.' + (pids.length > 1 ? 'more' : 'one'), {
                            pid: pids,
                            usage: Math.round(bytesInUse * 10000 / 102400) / 100
                        }),
                        "success"
                    )
                    this._trackProductDone()
                }
            })
    }

    /**
     * Injects a cloned target button - clicking it finishes product scan
     * in current container
     */
    _addTrackButton() {
        this.$found = new Promise((resolve, reject) => {
            StorageAPI
                .getSync(this.data.pid)
                .then(item => {
                    if ($.isEmptyObject(item)) {
                        this.$source = $('<button/>', {
                            type: "button",
                            text: I18N.translate('track.button.simple'),
                            class: this.sourceClass,
                            click: e => this._trackProduct()
                        })
                        .append(this._icon())
                        .insertAfter(this.$target)
                        resolve(this.data)
                    } else {
                        resolve()
                    }
                })
                .catch(reason => reject("Could not get target pid from sync store: " + this.data.pid))
        })
    }
}
