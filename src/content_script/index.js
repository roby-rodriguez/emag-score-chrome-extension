import GridScanner from "../utils/scanner/grid"
import FavoriteScanner from "../utils/scanner/favorite"
import FavoriteAllScanner from "../utils/scanner/favoriteAll"
import ProductPageScanner from "../utils/scanner/productPage"
import { I18N } from "../utils/i18n"

const initTracker = () => {
    try {

        $("#products-holder .product-holder-grid").each(function (index, value) {
            new GridScanner(this)
        })

        const favorites = []
        $("#wishlist-items .row").each(function (index, value) {
            const favorite = new FavoriteScanner(this)
            favorites.push(favorite.$found)
        })
        Promise
            .all(favorites)
            .then(products => {
                const filtered = products.filter(p => p)
                if (filtered.length)
                    new FavoriteAllScanner("#wishlists-container", filtered)
            })
            .catch(reason => console.warn(reason))

        $("form.main-product-form").each(function (index, value) {
            new ProductPageScanner(this)
        })

    } catch (error) {
        swal(I18N.translate('error.title'), I18N.translate('error.message', { error }), "error")
        console.warn(error)
    }
}

export { initTracker }
