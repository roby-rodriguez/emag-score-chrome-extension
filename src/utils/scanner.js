/**
 * Extracts price from the product's home page raw html string
 *
 * @param htmlText
 * @returns {string}
 */
function extractPriceRaw(htmlText) {
    var index = htmlText.indexOf('"price":')
    if (index > -1) {
        htmlText = htmlText.substring(index + 8)
        htmlText = htmlText.substr(0, htmlText.indexOf(","))
        return htmlText.trim()
    }
    index = htmlText.indexOf('product-new-price')
    if (index > -1) {
        var productNewPriceRegex = /.*>\D*(\d+)<sup>(\d+)<\/sup>.*/
        htmlText = htmlText.substring(index, index + 100)
        // find current tag of this class selector
        var found = htmlText.match(productNewPriceRegex)
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
function scanProductHomepage(pid, product) {
    console.log('Scanning pid=' + pid + ' at page: ' + product.url)
    $.get(product.url)
        .done(function(data) {
            if (data && data.length) {
                // TODO check for captchas and if none found then just update price
                var newPrice = extractPriceRaw(data)
                if (newPrice)
                    updatePrice(pid, newPrice)
                        .done(function() {
                            console.log('Finished scan for pid=' + pid)
                        })
                        .fail(function(xhr, status, error) {
                            console.warn('Could not scan pid=' + pid + '. Problem was ' + JSON.stringify({xhr: xhr, status: status, error: error}))
                        })
            }
        })
        .fail(function(xhr, status, error) {
            console.warn('Could not scan pid=' + pid + '. Caused by: ' + JSON.stringify({xhr: xhr, status: status, error: error}))
        })
}
