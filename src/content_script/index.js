import $ from 'jquery'
import { EmagTrackerAPI } from "../backend"
import { StoreAPI } from "../store"

/**
 * Extracts price as a string value from a page
 * with multiple products (grid)
 *
 * @param container
 * @returns {string}
 */
const extractPriceGrid = container => {
    const price = $(".price-over", container)
    if (price.length) {
        const int = price.find(".money-int"),
            dec = price.find(".money-decimal")
        if (int.length) {
            return int.text().replace(/\D+/g, "") +
                (dec.length ?  "." + dec.text().replace(/\D+/g, '') : "")
        }
    }
}

/**
 * Extracts price from the product's home page
 *
 * @param container
 * @returns {string}
 */
const extractPriceProductPage = container => {
    let price = $(".product-new-price", container)
    if (price.length) {
        const dec = price.find("sup")
        price = price.clone().children().remove().end().text()
        return price.replace(/\D+/g, "") +
            (dec.length ?  "." + dec.text().replace(/\D+/g, '') : "")
    }
}

/**
 * Adds product to local store
 *
 * @param pid
 * @param productData
 */
const addProductToLocalStore = (pid, productData) => {
    StoreAPI
        .getLocal(pid)
        .then(item => {
            if ($.isEmptyObject(item)) {
                const product = {
                    [pid]: productData
                }
                StoreAPI
                    .setLocal(product)
                    .catch(reason => {
                        console.warn("Could not save product to local store: " + pid)
                        console.warn(reason)
                    })
            }
        })
}

const setLoadingGrid = elem => {
    $(elem).empty()
    $(elem).css("padding-left", "10px")
    $(elem).append($('<img/>', {
        src: chrome.extension.getURL("res/images/ajax-loader.gif"),
        class: "loading-grid"
    }))
}
const unsetLoadingGrid = elem => {
    $(elem).text("track price")
    $(elem).css("padding-left", "35px")
    $(elem).append(
        $('<div/>', {
            class: "emg-btn-icon"
        }).append(
            $('<span/>', {
                class: "icon-i52-list-add"
            })
        )
    )
}
const setLoadingHomepage = elem => {
    $(elem).empty()
    $(elem).css("padding-left", "10px")
    $(elem).append($('<img/>', {
        src: chrome.extension.getURL("res/images/ajax-loader.gif"),
        class: "loading-homepage"
    }))
}
const unsetLoadingHomepage = elem => {
    $(elem).text("track price")
    $(elem).css("padding-left", "58px")
    $(elem).append(
        $('<i/>', {
            class: "em em-list-add_fill"
        })
    )
}

/**
 * Adds price-checker button to product grid
 * Template for grid:
 *
 <button class="emg-button add-to-price-checker">
    <div class="emg-btn-icon">
        <span class="icon-i52-list-add"></span>
    </div>
    add to price-checker
 </button>
*/
function addGridButton(target) {
    let pid = $(target).attr("p")
    if (!pid) {
        const container = $(target).closest("form") || $(target).closest(".product-holder-grid")
        pid = container.find("input[type='hidden']").first().val()
    }
    StoreAPI
        .getSync(pid)
        .then(item => {
            if ($.isEmptyObject(item)) {
                const cloned = $('<button/>', {
                    type: "button",
                    text: "track price", // urmareste pret
                    class: "emg-button add-to-price-checker",
                    click: function () {
                        let crashed
                        const result = {}
                        setLoadingGrid(this)
                        const container = $(target).closest("form") || $(target).closest(".product-holder-grid")
                        if (container.length) {
                            const priceValue = extractPriceGrid(container)
                            if (priceValue) {
                                result.price = priceValue

                                const link = container.find("a"), imageLink = $("img", link)
                                if (link.attr("href") && (link.attr("title") || link.attr("text"))) {
                                    result.title = link.attr("title") || link.attr("text")
                                    result.link = location.origin + link.attr("href")
                                    if (imageLink.length)
                                        result.imageLink = imageLink.attr("src")
                                } else {
                                    crashed = true
                                }
                            } else {
                                crashed = true
                            }
                        } else {
                            crashed = true
                        }

                        if (crashed) {
                            swal("Oops...", "Something went wrong! (DOM structure change)", "error")
                            unsetLoadingGrid(this)
                        } else {
                            const product = {
                                [pid]: result
                            }
                            StoreAPI
                                .setSync(product)
                                .then(StoreAPI.getUsage)
                                .then(bytesInUse =>
                                    EmagTrackerAPI
                                        .addProduct(product)
                                        .done(() => {
                                            console.log("Product " + pid + " is now tracked:" + JSON.stringify(result))
                                            swal("Added", "Product " + pid + " is now tracked!"
                                                + "\n\nSpace usage: " + Math.round(bytesInUse * 10000/102400)/100 + "%", "success")
                                            $(this).hide()
                                        })
                                        .fail((xhr, status, error) => {
                                            swal("Oops...", "Something went wrong!\n\nProblem was " + JSON.stringify({xhr: xhr, status: status, error: error}), "error")
                                            unsetLoadingGrid(this)
                                        })
                                        .always(() => {
                                            // add product to local store anyways
                                            addProductToLocalStore(pid, result)
                                        })
                                )
                        }
                    }
                })
                .append(
                    $('<div/>', {
                        class: "emg-btn-icon"
                    }).append(
                        $('<span/>', {
                            class: "icon-i52-list-add"
                        })
                    )
                )
                cloned.insertAfter(target)
            }
    })
    .catch(reason => {
        console.log(reason)
    })
}
/**
 * Adds price-checker button to product home page
 * Template for product home page:
 *
 <button class="btn btn-primary btn-emag btn-xl btn-block">
    <i class="emg-btn-icon" />
    add to price-checker
 </button>

 TODO remove this duplicate method
*/
function addProductPageButton(target) {
    let pid = $(target).attr("data-offer-id")
    if (!pid) {
        const container = $(target).closest("form")
        pid = container.find("input[type='hidden']").first().val()
    }
    StoreAPI
        .getSync(pid)
        .then(item => {
            if ($.isEmptyObject(item)) {
                const cloned = $('<button/>', {
                    type: "button",
                    text: "track price", // urmareste pret
                    class: "btn btn-primary btn-emag btn-xl btn-block",
                    click: function () {
                        let crashed
                        const result = {}
                        setLoadingHomepage(this)
                        const container = $(target).closest("form.main-product-form")
                        if (container.length) {
                            const priceValue = extractPriceProductPage(container)
                            if (priceValue) {
                                result.price = priceValue

                                const link = $(".page-title"),
                                    imageLink = $("a.product-gallery-image");
                                if (link.length) {
                                    result.title = link.text().trim()
                                    result.link = location.href
                                    if (imageLink.length)
                                        result.imageLink = imageLink.attr("href")
                                } else {
                                    crashed = true
                                }
                            } else {
                                crashed = true
                            }
                        } else {
                            crashed = true
                        }

                        if (crashed) {
                            swal("Oops...", "Something went wrong! (DOM structure change)", "error")
                            unsetLoadingHomepage(this)
                        } else {
                            const product = {
                                [pid]: result
                            }
                            StoreAPI
                                .setSync(product)
                                .then(StoreAPI.getUsage)
                                .then(bytesInUse =>
                                    EmagTrackerAPI
                                        .addProduct(product)
                                        .done(() => {
                                            console.log("Product " + pid + " is now tracked:" + JSON.stringify(result))
                                            swal("Added", "Product " + pid + " is now tracked!"
                                                + "\n\nSpace usage: " + Math.round(bytesInUse * 10000 / 102400) / 100 + "%", "success")
                                            $(this).hide()
                                        })
                                        .fail((xhr, status, error) => {
                                            swal("Oops...", "Something went wrong!\n\nProblem was " + JSON.stringify({
                                                    xhr: xhr,
                                                    status: status,
                                                    error: error
                                                }), "error")
                                            unsetLoadingHomepage(this)
                                        })
                                        .always(() => {
                                            // add product to local store anyways
                                            addProductToLocalStore(pid, result)
                                        })
                                )
                                .catch(reason => {
                                    console.log(reason)
                                })
                        }
                    }
                }).append(
                    $('<i/>', {
                        class: "em em-list-add_fill"
                    })
                )
                cloned.insertAfter(target)
            }
        })
        .catch(reason => {
            console.log(reason)
        })
}

const initTracker = () => {
    StoreAPI.getSync(null).then(() => {})

    $("button.add-to-cart-new").each(function (index, value) {
        addGridButton(this)
    })

    $(".main-container-inner button.yeahIWantThisProduct").each(function (index, value) {
        addProductPageButton(this)
    })
}

export { initTracker }
