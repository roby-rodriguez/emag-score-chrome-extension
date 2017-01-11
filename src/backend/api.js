function getProduct(pid) {
    return $.get("https://script.google.com/macros/s/AKfycbymgNqBL-Fgr0OsLsBLhcSkp-xKx5W-YshVbzLkgX8H9FrKI-w/exec?a=" + pid)
}

function addProduct(pid, product) {
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
}

function updatePrice(pid, newPrice) {
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
