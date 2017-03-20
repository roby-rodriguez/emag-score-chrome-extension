import co from 'co'
import { StorageAPI } from "../storage"
import { NotificationsAPI } from "../notifications"
import { MessagingAPI } from "../messaging"
import { I18N } from "../utils/i18n"
import { initChecker, triggerScan } from "../tasks/checker"
import { RESET_CHECKER, TRIGGER_SCAN, CHANGE_LANGUAGE, GET_LANGUAGE } from "../messaging/messageType"
import defaultSettings from "../utils/settings/defaultValues"
import messages from "./messages"

const _init = settings => {
    initChecker(settings)
    I18N.init(messages, settings.general.language)
}

co(function *() {
    try {
        let settings = defaultSettings
        const data = yield StorageAPI.getSync('settings')
        if ($.isEmptyObject(data))
            console.info('No user settings found. Using defaults.')
        else
            settings = data.settings
        _init(settings)
    } catch (e) {
        console.warn('Could not read user settings: ' + e)
        console.info('Using defaults.')
        _init(defaultSettings)
    }
})

/**
 * Main and only entry point for message handling
 */
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
        case GET_LANGUAGE:
            sendResponse(I18N.language())
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
