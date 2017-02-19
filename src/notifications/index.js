const NotificationsAPI = {}

NotificationsAPI.error = reason =>
    chrome.notifications.create('reminder', {
        type: 'basic',
        iconUrl: 'res/icons/icon128.png',
        title: 'Oops...',
        message: 'Something went wrong!\n\nCause: ' + JSON.stringify(reason)
    })

export { NotificationsAPI }
