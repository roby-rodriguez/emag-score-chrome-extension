import Base from "./base"
import { I18N } from "../i18n"

export default class FavoriteAll extends Base {
    constructor(container, products) {
        super(container, {
            products,
            sourceTitle: I18N.translate('track.button.all'),
            sourceClass: "emg-button add-all-favorites"
        })
    }
    _trackProductDone() {
        $("#track-all-row", this.$container).remove()
        $(".add-to-price-checker", this.$container).remove()
    }
    _addTrackButton() {
        const toolbox = $("#wishlistActions", this.$container).first()
        if (toolbox.length) {
            this.$source = $('<button/>', {
                type: "button",
                text: I18N.translate('track.button.all'),
                class: this.sourceClass,
                click: e => this._trackProduct(e.currentTarget)
            })
            .append(this._icon())

            $('<div>', {
                id: "track-all-row",
                class: "gui-stacked-row"
            }).append(
                this.$source
            ).insertAfter(toolbox)
        }
    }
}
