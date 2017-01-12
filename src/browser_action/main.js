function render(view, data) {
    load($("#page-content-wrapper"), view, data)
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
                    render('chart', item)
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
    render('home')
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
                    .fail(function(xhr, status, error) {
                        console.warn("Remote fetch failed for pid=" + item + ". Loading from local. Problem was " + JSON.stringify({xhr: xhr, status: status, error: error}))
                        chrome.storage.get(item, function(data) {
                            if (chrome.runtime.lastError) {
                                console.error("Local fetch failed for pid=" + item + ". Problem was " + chrome.runtime.lastError)
                            } else {
                                addProductToList(item, data)
                            }
                        })
                    })
            }
        }
    })
})
