import Base from "./base"
import priceExtractor from "./extractors/price"

@priceExtractor({
    selector: ".price-over"
})
export default class Favorite extends Base {
    constructor(container) {
        super(container, {
            selector: "button.emg-button:enabled",
            targetClass: "emg-button add-to-price-checker"
        })
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
        $(this).empty()
        $(this).css("padding-left", "10px")
        $(this).append($('<img/>', {
            src: chrome.extension.getURL("res/images/ajax-loader.gif"),
            class: "loading-grid"
        }))
    }
    _hideLoader() {
        $(this).text("track price")
        $(this).css("padding-left", "35px")
        $(this).append(
            $('<div/>', {
                class: "emg-btn-icon"
            }).append(
                $('<span/>', {
                    class: "icon-i52-list-add"
                })
            )
        )
    }
    _extractPid() {
        this.pid = this.$container.find("input[name='service_parrent_id']").first().val()
            || $("form.spi-buy", this.$container).find("input[type='hidden']").first().val()
        if (!this.pid)
            throw new Error("pid not found")
    }
    _extractLink() {
        const link = this.$container.find("a"),
            imageLink = $("img", link)
        if (link.attr("href") && (link.attr("title") || link.attr("text"))) {
            this.data.title = link.attr("title") || link.attr("text")
            this.data.url = location.origin + link.attr("href")
            if (imageLink.length) {
                let imageLinkUrl = imageLink.attr("src")
                if (imageLinkUrl)
                    this.data.imgUrl = imageLinkUrl
                else
                    imageLink.on('load',() => this.data.imgUrl = imageLink.attr("src"))
            }
        } else {
            throw new Error("product data not found")
        }
    }
    static addTrackAllButton(data) {
        const toolbox = $("#wishlistActions", this.$container).first()
        if (toolbox.length) {
            $('<div>', {
                class: "gui-stacked-row"
            }).append(
                Favorite
                    ._createButton("emg-button add-all-favorites", jq => {
                        console.log(data)
                    })
                    .prepend(this.prototype._icon())
            ).insertAfter(toolbox)
        }
    }
}
