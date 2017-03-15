import Base from "./base"
import priceExtractor from "./extractors/price"

@priceExtractor({
    selector: ".product-new-price"
})
export default class ProductPage extends Base {
    _icon() {
        return $('<i/>', {
            class: "em em-list-add_fill"
        })
    }
    _targetBtnClass() {
        return "btn btn-primary btn-emag btn-xl btn-block"
    }
    _showLoader() {
        $(this).empty()
        $(this).css("padding-left", "10px")
        $(this).append($('<img/>', {
            src: chrome.extension.getURL("res/images/ajax-loader.gif"),
            class: "loading-homepage"
        }))
    }
    _hideLoader() {
        $(this).text("track price")
        $(this).css("padding-left", "58px")
        $(this).append(
            $('<i/>', {
                class: "em em-list-add_fill"
            })
        )
    }

    /**
     * TODO extract some decorator that throws error if current property not extracted
     *
     * e.g. @Extractor("container")
     */
    _findContainer(target) {
        const container = $(target).closest("form.main-product-form")
        if (container.length)
            return container
        else
            throw new Error("container not found")
    }
    _extractPid(target, container) {
        this.pid = container.find("input[type='hidden']").first().val()
        if (!this.pid)
            throw new Error("pid not found")
    }
    _extractLink() {
        const link = $(".page-title"),
            imageLink = $("img", $("#product-gallery")).first()
        if (link.length) {
            this.data.title = link.text().trim()
            this.data.url = location.href
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
}
