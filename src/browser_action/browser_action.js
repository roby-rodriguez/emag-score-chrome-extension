function homeView() {
    $("#page-content-wrapper")
        .empty()
        // TODO use some templating instead of this shit
        .append(
            $('<div>', {
                class: "row"
            }).append(
                $('<div>', {
                    class: "col-lg-12"
                }).append(
                    $('<h1>Simple Sidebar</h1>')
                ).append(
                    $('<p>This template has a responsive menu toggling system. The menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens. When toggled using the button below, the menu will appear/disappear. On small screens, the page content will be pushed off canvas.</p>')
                ).append(
                    $('<p>Make sure to keep all page content within the <code>#page-content-wrapper</code>.</p>')
                ).append(
                    $('<a href="#menu-toggle" class="btn btn-default" id="menu-toggle">Toggle Menu</a>')
                )
            )
        )
}

function chartView(product) {
    $("#page-content-wrapper")
        .empty()
        // TODO use some templating instead of this shit
        .append(
            $('<div>', {
                class: "row"
            }).append(
                $('<div>', {
                    class: "col-lg-2"
                }).append(
                    $('<img>', {
                        src: product.productImageUrl,
                        alt: product.title,
                        height: 150,
                        width: 150
                    })
                )
            ).append(
                $('<div>', {
                    class: "col-lg-10"
                }).append(
                    $('<h1>' + product.title + '</h1>')
                )
            )
    ).append(
        $('<div>', {
            class: "row"
        }).append(
            $('<div>', {
                class: "col-lg-12"
            }).append(
                $('<div id="price-history-graph-container"></div>')
            )
        )
    ).append(
        $('<div>', {
            class: "row"
        }).append(
            $('<div>', {
                class: "col-lg-2"
            }).append(
                $('<a/>', {
                    href: product.url,
                    class: "btn btn-default",
                    text: "View product home page"
                })
            )
        ).append(
            $('<div>', {
                class: "col-lg-2"
            }).append(
                $('<a/>', {
                    class: "btn btn-default",
                    text: "Remove from tracked list"
                })
            )
        ).append(
            $('<div>', {
                class: "col-lg-2"
            }).append(
                $('<a/>', {
                    class: "btn btn-default btn-danger",
                    text: "Report"
                })
            )
        )
    )

}
function processHistory(history) {
    var result = []
    for (var item in history) {
        result.push({
            dateRecorded: item,
            price: history[item]
        })
    }
    return result
}
function addProductToList(pid, item) {
    $('<li>')
        .append(
            $('<a>', {
                href: "#",
                title: item.title,
                text: item.title,
                click: function () {
                    chartView(item)
                    setTimeout(function() {
                        new Morris.Area({
                            element: 'price-history-graph-container',
                            data: processHistory(item.history),
                            xkey: 'dateRecorded',
                            ykeys: ['price'],
                            labels: ['Price'],
                            xLabels: 'day',
                            parseTime: false,
                            pointSize: 2,
                            hideHover: 'auto',
                            fillOpacity: 0.5,
                            resize: true
                        })
                    }, 500)
                }
            })
        ).appendTo('#products')
}

$(function() {
    homeView()
    chrome.storage.sync.get(null, function(items) {
        delete items.lastCheck
        if ($.isEmptyObject(items)) {
            // show some text - no products marked yet
        } else {
            for (var item in items) {
                getProduct(item)
                    .done(function(data) {
                        addProductToList(item, data)
                    })
                    .fail(function(xhr) {
                        console.warn("Remote fetch failed for pid=" + item + ". Loading from local.")
                        chrome.storage.get(item, function(data) {
                            if (chrome.runtime.lastError) {
                                console.error("Local fetch failed for pid=" + item + ". Cause: " + chrome.runtime.lastError)
                            } else {
                                addProductToList(item, data)
                            }
                        })
                    })
            }
        }
    })
})
