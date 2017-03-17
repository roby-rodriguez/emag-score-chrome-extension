import GridScanner from "../utils/scanner/grid"
import FavoriteScanner from "../utils/scanner/favorite"
import ProductPageScanner from "../utils/scanner/productPage"

const initTracker = () => {
    $("#products-holder .product-holder-grid").each(function (index, value) {
        new GridScanner(this)
    })

    const products = []
    $("#wishlist-items .row").each(function (index, value) {
        const favorite = new FavoriteScanner(this)
        if (favorite.data)
            products.push(favorite.data)
    })
    FavoriteScanner.addTrackAllButton(products)

    $("form.main-product-form").each(function (index, value) {
        new ProductPageScanner(this)
    })
}

export { initTracker }
