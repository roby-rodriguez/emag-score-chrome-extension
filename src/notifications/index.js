const NotificationsAPI = {}

const defaultErrorTitle = 'Something went wrong!'

NotificationsAPI.error = (reason, title=defaultErrorTitle) =>
    chrome.notifications.create('error', {
        type: 'basic',
        iconUrl: 'res/icons/icon128.png',
        title: 'Oops...',
        message: title + '\n\n' + reason
    })

NotificationsAPI.info = (message, title, pid='') =>
    chrome.notifications.create('info'+pid, {
        type: 'basic',
        iconUrl: 'res/icons/icon128.png',
        title: title,
        message: message
    })

NotificationsAPI.badgeColor = color =>
    chrome.browserAction.setBadgeBackgroundColor({color})

NotificationsAPI.incrementBadgeCounter = () =>
    chrome.browserAction.getBadgeText({}, text => {
        chrome.browserAction.setBadgeText({text: ~~text+1+''})
    })

NotificationsAPI.resetBadgeCounter = () =>
    chrome.browserAction.setBadgeText({text:''})

export { NotificationsAPI }
