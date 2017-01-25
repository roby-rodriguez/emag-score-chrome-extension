window.EmagTrackerAPI = (function() {

    return {
        getProduct: function(pid) {
            return $.get("https://script.google.com/macros/s/AKfycbymgNqBL-Fgr0OsLsBLhcSkp-xKx5W-YshVbzLkgX8H9FrKI-w/exec?a=" + pid)
        },
        addProduct: function(pid, product) {
            return $.ajax({
                url: "https://script.google.com/macros/s/AKfycbymgNqBL-Fgr0OsLsBLhcSkp-xKx5W-YshVbzLkgX8H9FrKI-w/exec",
                type: "POST",
                contentType: "application/json",//"x-www-form-urlencoded",
                data: {
                    a: "1",
                    b: pid,
                    c: product.title,
                    d: product.link,
                    e: product.imageLink,
                    f: product.price
                }
            })
        },
        updatePrice: function(pid, newPrice) {
            return $.ajax({
                url: "https://script.google.com/macros/s/AKfycbymgNqBL-Fgr0OsLsBLhcSkp-xKx5W-YshVbzLkgX8H9FrKI-w/exec",
                type: "POST",
                contentType: "application/json",
                data: {
                    a: "2",
                    b: pid,
                    c: newPrice
                }
            })
        }
    }
})()
