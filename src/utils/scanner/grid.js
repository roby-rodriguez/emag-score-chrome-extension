import Base from "./base"
import priceExtractor from "./extractors/price"

@priceExtractor({
    selector: ".price-over"
})
export default class Grid extends Base {
    _icon() {
        return $('<div/>', {
            class: "emg-btn-icon"
        }).append(
            $('<span/>', {
                class: "icon-i52-list-add"
            })
        )
    }
    _targetBtnClass() {
        return "emg-button add-to-price-checker"
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

    /**
     * TODO extract some decorator that throws error if current property not extracted
     *
     * e.g. @Extractor("container")
     */
    _findContainer(target) {
        let container = $(target).closest("form")
        if (container.length)
            return container
        else {
            container = $(target).closest(".product-holder-grid")
            if (container.length)
                return container
        }
        throw new Error("container not found")
    }
    _extractPid(target, container) {
        this.pid = $(target).attr("p") || container.find("input[type='hidden']").first().val()
        if (!this.pid)
            throw new Error("pid not found")
    }
    _extractLink(container) {
        const link = container.find("a"),
            imageLink = $("img", link)
        if (link.attr("href") && (link.attr("title") || link.attr("text"))) {
            this.data.title = link.attr("title") || link.attr("text")
            this.data.url = location.origin + link.attr("href")
            if (imageLink.length) {
                let imageLinkUrl = imageLink.attr("data-src")
                if (imageLinkUrl)
                    this.data.imgUrl = imageLinkUrl
                else
                    imageLink.on('load',() => this.data.imgUrl = imageLink.attr("src"))
            }
        } else {
            throw new Error("product data not found")
        }
    }
}
