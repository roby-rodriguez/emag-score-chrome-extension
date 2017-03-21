import { I18N } from "../utils/i18n"

const NotificationsAPI = {}

NotificationsAPI.error = (error, messageKey='error.message') =>
    chrome.notifications.create('error', {
        type: 'basic',
        iconUrl: 'res/icons/icon128.png',
        title: I18N.translate('error.title'),
        message: I18N.translate(messageKey, { error })
    })

NotificationsAPI.info = (titleKey, messageKey, params, pid='') =>
    chrome.notifications.create('info'+pid, {
        type: 'basic',
        iconUrl: 'res/icons/icon128.png',
        title: I18N.translate(titleKey),
        message: I18N.translate(messageKey, params)
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
