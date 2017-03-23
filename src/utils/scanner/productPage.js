import Base from "./base"
import priceExtractor from "./extractors/price"

@priceExtractor({
    selector: ".product-new-price"
})
export default class ProductPage extends Base {
    constructor(container) {
        super(container, {
            selector: "button.yeahIWantThisProduct",
            sourceClass: "btn btn-primary btn-emag btn-xl btn-block",
            loaderClass: "loading-homepage",
            loaderPadding: 58
        })
    }
    _icon() {
        return $('<i/>', {
            class: "em em-list-add_fill"
        })
    }
    _extractPid() {
        this.data.pid = this.$container.find("input[type='hidden']").first().val()
        if (!this.data.pid)
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
