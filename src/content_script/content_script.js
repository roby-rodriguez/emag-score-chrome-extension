/**
 * Extracts price as a string value
 *
 * @param container
 * @returns {string}
 */
function extractPriceGrid(container) {
    var price = $(".price-over", container)
    if (price.length) {
        var int = price.find(".money-int"),
            dec = price.find(".money-decimal")
        if (int.length) {
            return int.text().replace(/\D+/g, "") +
                (dec.length ?  "." + dec.text().replace(/\D+/g, '') : "")
        }
    }
}
function extractPriceProductPage(container) {
    var price = $(".product-new-price", container)
    if (price.length) {
        var dec = price.find("sup")
        price = price.clone().children().remove().end().text()
        return price.replace(/\D+/g, "") +
            (dec.length ?  "." + dec.text().replace(/\D+/g, '') : "")
    }
}
function addProductToStore(pid, product, callback) {
    chrome.storage.sync.get(pid, function(item) {
        if (!$.isEmptyObject(item)) {
            console.warn("Found previously existing tracked product: " + pid)
        }
        chrome.storage.sync.remove(pid, function() {
            chrome.storage.sync.set(product, function () {
                if (chrome.runtime.lastError) {
                    callback(chrome.runtime.lastError.message)
                } else {
                    chrome.storage.sync.getBytesInUse(null, function(bytesInUse) {
                        if (chrome.runtime.lastError) {
                            callback(chrome.runtime.lastError.message)
                        } else {
                            callback(null, bytesInUse)
                        }
                    })
                }
            })
        })
    })
}
//TODO
function updateProductPrice(pid, newPrice, callback) {
    chrome.storage.sync.get(pid, function(item) {
        if (!$.isEmptyObject(item)) {

        }
    })
}
/**
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
    var pid = $(target).attr("p")
    if (!pid) {
        var container = $(target).closest("form") || $(target).closest(".product-holder-grid")
        pid = container.find("input[type='hidden']").first().val()
    }
    chrome.storage.sync.get(pid, function(item) {
        if ($.isEmptyObject(item)) {
            var cloned = $('<button/>', {
                type: "button",
                text: "track price", // urmareste pret
                class: "emg-button add-to-price-checker",
                click: function () {
                    var crashed, result = {};
                    var container = $(target).closest("form") || $(target).closest(".product-holder-grid")
                    if (container.length) {
                        var priceValue = extractPriceGrid(container)
                        if (priceValue) {
                            result["price"] = [ priceValue ]

                            var link = container.find("a")
                            if (link.attr("href") && (link.attr("title") || link.attr("text"))) {
                                result["title"] = link.attr("title") || link.attr("text")
                                result["link"] = location.origin + link.attr("href")
                            } else {
                                crashed = true
                            }
                        } else {
                            crashed = true
                        }
                    } else {
                        crashed = true
                    }

                    var self = this;
                    if (crashed) {
                        swal("Oops...", "Something went wrong! (DOM structure change)", "error")
                    } else {
                        addProductToStore(pid, {
                            [pid]: result
                        }, function(err, bytesInUse) {
                            if (err) {
                                swal("Oops...", "Something went wrong! (" + err + ")", "error")
                            } else {
                                swal("Added", "Product " + pid + " is now tracked: " + JSON.stringify(result)
                                    + "\n\nSpace usage: " + Math.round(bytesInUse * 10000/102400)/100 + "%", "success")
                                $(self).hide()
                            }
                        })
                    }
                }
            }).append(
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
}
/**
 * Template for product home page:
 *
 <button class="btn btn-primary btn-emag btn-xl btn-block">
    <i class="emg-btn-icon" />
    add to price-checker
 </button>
*/
function addProductPageButton(target) {
    var pid = $(target).attr("data-offer-id")
    if (!pid) {
        var container = $(target).closest("form") || $(target).closest(".product-holder-grid")
        pid = container.find("input[type='hidden']").first().val()
    }
    chrome.storage.sync.get(null, function(item) {
        console.log("Store is: ")
        console.log(item)
    })
    chrome.storage.sync.get(pid, function(item) {
        if ($.isEmptyObject(item)) {
            var cloned = $('<button/>', {
                type: "button",
                text: "track price", // urmareste pret
                class: "btn btn-primary btn-emag btn-xl btn-block",
                click: function () {
                    var crashed, result = {};
                    var container = $(target).closest("form.main-product-form")
                    if (container.length) {
                        var priceValue = extractPriceProductPage(container)
                        if (priceValue) {
                            result["price"] = priceValue

                            var link = $(".page-title")
                            if (link.length) {
                                result["title"] = link.text().trim()
                                result["link"] = location.href
                            } else {
                                crashed = true
                            }
                        } else {
                            crashed = true
                        }
                    } else {
                        crashed = true
                    }

                    var self = this;
                    if (crashed) {
                        swal("Oops...", "Something went wrong! (DOM structure change)", "error")
                    } else {
                        addProductToStore(pid, {
                            [pid]: result
                        }, function(err, bytesInUse) {
                            if (err) {
                                swal("Oops...", "Something went wrong! (" + err + ")", "error")
                            } else {
                                swal("Added", "Product " + pid + " is now tracked: " + JSON.stringify(result)
                                    + "\n\nSpace usage: " + Math.round(bytesInUse * 10000/102400)/100 + "%", "success")
                                $(self).hide()
                            }
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
}

$("button.add-to-cart-new").each(function (index, value) {
    addGridButton(this)
})

$(".main-container-inner button.yeahIWantThisProduct").each(function (index, value) {
    addProductPageButton(this)
})
