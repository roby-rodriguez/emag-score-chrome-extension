import Base from "./base"
import priceExtractor from "./extractors/price"

@priceExtractor({
    selector: ".product-new-price"
})
export default class ProductPage extends Base {
    constructor(container) {
        super(container, {
            selector: "button.yeahIWantThisProduct",
            targetClass: "btn btn-primary btn-emag btn-xl btn-block"
        })
    }
    _icon() {
        return $('<i/>', {
            class: "em em-list-add_fill"
        })
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
    _extractPid() {
        this.pid = this.$container.find("input[type='hidden']").first().val()
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
