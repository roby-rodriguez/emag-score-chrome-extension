const today = () =>
    new Date().setHours(0, 0, 0, 0) / 100000
const fromTimestamp = timestamp =>
    new Date(Number(timestamp + "00000"))
const shortenString = (str, maxLength=20) => {
    if (str && str.length > maxLength)
        return str.substring(0, maxLength) + "..."
    return str
}
const getProductObject = (product, empty=false) => {
    const obj = {}
    if (!empty) obj[product.pid] = product
    return obj
}

const toArray = data => {
    return $.isArray(data) ? data : [ data ]
}

export { today, fromTimestamp, shortenString, getProductObject, toArray }
