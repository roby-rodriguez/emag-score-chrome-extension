const MessagingAPI = {}

MessagingAPI.send = message =>
    new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, response => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve(response)
            }
        })
    })

MessagingAPI.init = callback =>
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        return callback(message, sendResponse)
    })

export { MessagingAPI }
