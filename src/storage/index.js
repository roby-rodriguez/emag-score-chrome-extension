const StorageAPI = {}

/**
 * Promisify callback-based API call
 *
 * @param item
 * @returns {Promise}
 */
StorageAPI.getSync = item =>
    new Promise((resolve, reject) => {
        chrome.storage.sync.get(item, found => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve(found)
            }
        })
    })

StorageAPI.setSync = item =>
    new Promise((resolve, reject) => {
        chrome.storage.sync.set(item, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve()
            }
        })
    })

StorageAPI.getLocal = item =>
    new Promise((resolve, reject) => {
        chrome.storage.local.get(item, found => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve(found)
            }
        })
    })

StorageAPI.setLocal = item =>
    new Promise((resolve, reject) => {
        chrome.storage.local.set(item, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve()
            }
        })
    })

StorageAPI.getUsage = item =>
    new Promise((resolve, reject) => {
        chrome.storage.sync.getBytesInUse(item, bytesInUse => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve(bytesInUse)
            }
        })
    })

StorageAPI.removeSync = item =>
    new Promise((resolve, reject) => {
        chrome.storage.sync.remove(item, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve()
            }
        })
    })

StorageAPI.removeLocal = item =>
    new Promise((resolve, reject) => {
        chrome.storage.local.remove(item, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve()
            }
        })
    })

export { StorageAPI }
