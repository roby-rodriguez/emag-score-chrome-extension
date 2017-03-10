import { StorageAPI } from "../storage"
import { NotificationsAPI } from "../notifications"
import { MessagingAPI } from "../messaging"
import { I18N } from "../utils/i18n"
import { initChecker } from "../tasks/checker"
import { adapt } from "../utils/settings"
import { RESET_CHECKER, CHANGE_LANGUAGE } from "../messaging/messageType"
import defaultSettings from "../utils/settings/defaultValues"
import messages from "./messages"

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
            initChecker(message.value)
            break
        case CHANGE_LANGUAGE:
            I18N.language(message.value)
            break
        default:
            break
    }
})

chrome.browserAction.onClicked.addListener(() => {
    NotificationsAPI.resetBadgeCounter()
    chrome.tabs.create({ url: chrome.runtime.getURL("browser_action.html") })
})
