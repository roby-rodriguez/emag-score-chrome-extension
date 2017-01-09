function addProductToList(pid, item) {
    $('<li>')
        .append(
            $('<a>', {
                href: "#",
                title: item.title,
                text: item.title,
                click: function () {
                    // TODO use item to display price in graphs
                }
            })
        ).appendTo('#products')
}

$(function() {
    $.get("https://script.google.com/macros/s/AKfycbypRbbJBkM7g3P9TD5GzAvtMogYDwr7T6foMPjtq8DpYwFKfVXy/exec?pid=" + "123455", function( data ) {
        console.log("Received: ")
        console.log(data)
    });
    chrome.storage.sync.get(null, function(items) {
        if ($.isEmptyObject(items)) {
            // show some text - no products marked yet
        } else {
            for (var item in items) {
                addProductToList(item, items[item])
            }
        }
    })
})