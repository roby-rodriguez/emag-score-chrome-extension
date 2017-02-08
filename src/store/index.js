const StoreAPI = {}

/**
 * Promisify callback-based API call
 *
 * @param item
 * @returns {Promise}
 */
StoreAPI.getSync = item =>
    new Promise((resolve, reject) => {
        chrome.storage.sync.get(item, found => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve(found)
            }
        })
    })

StoreAPI.setSync = item =>
    new Promise((resolve, reject) => {
        chrome.storage.sync.set(item, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve()
            }
        })
    })

StoreAPI.getLocal = item =>
    new Promise((resolve, reject) => {
        chrome.storage.local.get(item, found => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve(found)
            }
        })
    })

StoreAPI.setLocal = item =>
    new Promise((resolve, reject) => {
        chrome.storage.local.set(item, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve()
            }
        })
    })

StoreAPI.getUsage = item =>
    new Promise((resolve, reject) => {
        chrome.storage.sync.getBytesInUse(item, bytesInUse => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve(bytesInUse)
            }
        })
    })

export { StoreAPI }
