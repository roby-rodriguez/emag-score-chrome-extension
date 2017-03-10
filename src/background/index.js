import { I18N } from "../utils/i18n"
import { initChecker } from "../tasks/checker"
import { getSettings, setSettings } from "../utils/settings"
import { StorageAPI } from "../storage"
import { NotificationsAPI } from "../notifications"
import defaultSettings from "../utils/settings/defaultValues"

const _init = () => {
    const settings = getSettings()
    initChecker(settings)
    I18N.init(settings.general.language)
}

StorageAPI
    .getSync('settings')
    .then(data => {
        if ($.isEmptyObject(data))
            console.info('No user settings found. Using defaults.')
        else
            setSettings(defaultSettings)

    })
    .catch(reason => {
        console.warn('Could not read user settings. ' + reason)
        console.info('Using defaults.')
    })
    .then(() => {//init(Settings.get()))
        // TODO test if this code is reached in case of error/catch exec
        _init()
    })

chrome.browserAction.onClicked.addListener(function () {
    NotificationsAPI.resetBadgeCounter()
    chrome.tabs.create({ url: chrome.runtime.getURL("browser_action.html") });
});
