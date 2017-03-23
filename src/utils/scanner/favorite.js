import Base from "./base"
import priceExtractor from "./extractors/price"

@priceExtractor({
    selector: ".price-over"
})
export default class Favorite extends Base {
    constructor(container) {
        super(container, {
            selector: "button.emg-button:enabled",
            sourceClass: "emg-button add-to-price-checker"
        })
    }
    _extractPid() {
        this.data.pid = this.$container.find("input[name='service_parrent_id']").first().val()
            || $("form.spi-buy", this.$container).find("input[type='hidden']").first().val()
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
