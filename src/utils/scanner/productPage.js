import $ from 'jquery'
import Base from "./base"

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
    _extractPrice(container) {
        const price = $(".product-new-price", container)
        if (price.length) {
            const int = price.clone().children().remove().end(),
                dec = price.find("sup")
            if (int.length) {
                return this.data.price = int.text().replace(/\D+/g, "") +
                    (dec.length ?  "." + dec.text().replace(/\D+/g, '') : "")
            }
        }
        throw new Error("price not found")
    }
    _extractLink() {
        const link = $(".page-title"),
            imageLink = $("a.product-gallery-image")
        if (link.length) {
            this.data.title = link.text().trim()
            this.data.url = location.href
            if (imageLink.length)
                this.data.imgUrl = imageLink.attr("src")
        } else {
            throw new Error("product data not found")
        }
    }
}
