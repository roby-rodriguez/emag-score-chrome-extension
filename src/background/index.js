import { StorageAPI } from "../storage"
import { NotificationsAPI } from "../notifications"
import { MessagingAPI } from "../messaging"
import { I18N } from "../utils/i18n"
import { initChecker, triggerScan } from "../tasks/checker"
import { RESET_CHECKER, TRIGGER_SCAN, CHANGE_LANGUAGE } from "../messaging/messageType"
import defaultSettings from "../utils/settings/defaultValues"

StorageAPI
    .getSync('settings')
    .then(data => {
        if ($.isEmptyObject(data)) {
            console.info('No user settings found. Using defaults.')
            initChecker(defaultSettings)
        } else {
            initChecker(data.settings)
        }
    })
    .catch(reason => {
        console.warn('Could not read user settings. ' + reason)
        console.info('Using defaults.')
        initChecker(defaultSettings)
    })

MessagingAPI.init((message, sendResponse) => {
    switch (message.type) {
        case RESET_CHECKER:
            initChecker(message.value, sendResponse)
            break
        case TRIGGER_SCAN:
            triggerScan(message.value, sendResponse)
            break
        case CHANGE_LANGUAGE:
            sendResponse()
            I18N.language(message.value)
            break
        default:
            break
    }
    return true
})

chrome.browserAction.onClicked.addListener(() => {
    NotificationsAPI.resetBadgeCounter()
    chrome.tabs.create({ url: chrome.runtime.getURL("browser_action.html") })
})
