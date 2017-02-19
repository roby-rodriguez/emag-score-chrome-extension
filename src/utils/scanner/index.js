import $ from 'jquery'

const productNewPriceRegex = /.*>\D*(\d+)<sup>(\d+)<\/sup>.*/

/**
 * Extracts price from the product's home page raw html string
 *
 * @param htmlText
 * @returns {string}
 */
const extractPriceRaw = htmlText => {
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
 * @param pid
 * @param product
 */
const scanProductHomepage = (pid, product) => {
    console.log('Scanning pid=' + pid + ' at page: ' + product.url)
    $.get(product.url)
        .done(data => {
            if (data && data.length) {
                // TODO check for captchas and if none found then just update price
                const newPrice = extractPriceRaw(data)
                if (newPrice)
                    EmagTrackerAPI
                        .updatePrice(pid, newPrice)
                        .done(() => {
                            console.log('Finished scan for pid=' + pid)
                        })
                        .fail((xhr, status, error) => {
                            console.warn('Could not scan pid=' + pid + '. Problem was ' + JSON.stringify({xhr: xhr, status: status, error: error}))
                        })
            }
        })
        .fail((xhr, status, error) => {
            console.warn('Could not scan pid=' + pid + '. Caused by: ' + JSON.stringify({xhr: xhr, status: status, error: error}))
        })
}

export { scanProductHomepage }
