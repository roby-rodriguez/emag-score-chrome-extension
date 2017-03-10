// TODO refactor - move this to root directory but only after refactoring webpack relative paths
import { I18N } from "../i18n"
import { StorageAPI } from "../../storage"
import { resetChecker } from "../../tasks/checker"
import defaultValues from "./defaultValues"

const _background = chrome.extension.getBackgroundPage()
const _settings = data => {
    const values = data || (_background._settings ? null : defaultValues)
    if (values)
        _background._settings = values
    return _background._settings
}

const getSettings = () => _settings()
const getLanguage = () => _settings().general.language
const setSettings = settings => _settings(settings)
const setAsyncSettings = settings =>
    StorageAPI
        .setSync({ settings })
        .then(() => {
            if (_settings().scan.timeout !== settings.scan.timeout)
                resetChecker(settings.scan.timeout)
            _settings(settings)
        })
        .catch(error => swal(I18N.translate('error.title','swal'), I18N.translate('error.message','swal', { error }), "error"))
const resetAsyncSettings = (property = 'settings') =>
    StorageAPI
        .removeSync(property)
        .then(() => {
            if (property === 'settings')
                delete _background._settings
            resetChecker(defaultValues.scan.timeout)
        })
        .catch(error => swal(I18N.translate('error.title','swal'), I18N.translate('error.message','swal', { error }), "error"))

export { getSettings, setSettings, setAsyncSettings, resetAsyncSettings, getLanguage }
