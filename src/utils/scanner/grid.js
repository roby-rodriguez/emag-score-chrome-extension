import Base from "./base"
import priceExtractor from "./extractors/price"

@priceExtractor({
    selector: ".price-over"
})
export default class Grid extends Base {
    constructor(container) {
        super(container, {
            selector: "button.add-to-cart-new",
            sourceClass: "emg-button add-to-price-checker"
        })
    }
    _extractPid() {
        this.data.pid = this.$target.attr("p") || this.$container.find("input[type='hidden']").first().val()
        if (!this.data.pid)
            throw new Error("pid not found")
    }
    _extractLink() {
        const link = this.$container.find("a"),
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
