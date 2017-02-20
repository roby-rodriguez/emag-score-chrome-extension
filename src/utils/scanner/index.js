import $ from 'jquery'
import { EmagTrackerAPI } from "../../backend"
import { updatePrice } from "../product"

const productNewPriceRegex = /.*>\D*(\d+)<sup>(\d+)<\/sup>.*/

/**
 * Extracts price from the product's home page raw html string
 *
 * @param htmlText
 * @returns {string}
 */
const _extractPriceRaw = htmlText => {
    let index = htmlText.indexOf('"price":')
    if (index > -1) {
        htmlText = htmlText.substring(index + 8)
        htmlText = htmlText.substr(0, htmlText.indexOf(","))
        return htmlText.trim()
    }
    index = htmlText.indexOf('product-new-price')
    if (index > -1) {
        htmlText = htmlText.substring(index, index + 100)
        // find current tag of this class selector
        const found = htmlText.match(productNewPriceRegex)
        if (found)
            return found[1] + found[2]
    }
}

/**
 * Makes GET request on product home page and updates price
 *
 * @param product
 */
const scanProductHomepage = product =>
    new Promise((resolve, reject) => {
        // first load product page
        $.get(product.url)
            .done(data => {
                if (data && data.length) {
                    // TODO check for captchas and if none found then just update price
                    const newPrice = _extractPriceRaw(data)
                    if (newPrice)
                        EmagTrackerAPI
                            .updatePrice(product.pid, newPrice)
                            .done(() => resolve(newPrice))
                            .fail((xhr, status, error) => {
                                console.warn('Could not scan pid=' + product.pid + '. Problem was '
                                    + JSON.stringify({xhr: xhr, status: status, error: error}))
                                reject('Could not update price for pid=' + product.pid)
                            })
                            .always(() => {
                                // also update price for local product
                                updatePrice(product.pid, newPrice)
                            })
                }
            })
            .fail((xhr, status, error) => {
                console.warn('Could not scan pid=' + product.pid + '. Caused by: '
                    + JSON.stringify({xhr: xhr, status: status, error: error}))
                reject('Could not load product page for pid=' + product.pid)
            })
    })

export { scanProductHomepage }
