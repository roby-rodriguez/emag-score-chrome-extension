/**
 * Decorator for extracting price
 *
 * @param selector for price container
 * @param failFast if should throw an error
 */
export default ( { selector, failFast=true }) => target => {
    target.prototype._extractPrice = container => {
        const price = $(selector, container).first()
        if (price.length) {
            const matches = price
                .html()
                // apply pattern matching
                .match(/\d+(?:\d+)?/g)
            if (matches && matches.length)
                // concatenate numbers as string e.g. "ddddd.ddd"
                return matches.reduce((acc, val, idx, arr) => {
                    if (arr.length == 1) return val
                    else if (idx == arr.length - 1) return acc + "." + val
                    else return acc + val
                }, "")
        }
        if (failFast)
            throw new Error("price not found")
    }
}
