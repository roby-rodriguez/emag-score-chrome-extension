import $ from 'jquery'
import GridScanner from "../utils/scanner/grid"
import ProductPageScanner from "../utils/scanner/productPage"

const initTracker = () => {
    $("button.add-to-cart-new").each(function (index, value) {
        new GridScanner(this)
    })

    $(".main-container-inner button.yeahIWantThisProduct").each(function (index, value) {
        new ProductPageScanner(this)
    })
}

export { initTracker }
