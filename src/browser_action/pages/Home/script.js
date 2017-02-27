export default {
    computed: {
        icon: () => chrome.extension.getURL("res/icons/icon48.png"),
        title: () => chrome.i18n.getMessage("appName"),
        aboutTitle: () => chrome.i18n.getMessage("home_about"),
        aboutDescription: () => chrome.i18n.getMessage("home_description"),
        how: () => chrome.i18n.getMessage("home_how"),
        howText: () => chrome.i18n.getMessage("home_how_text"),
        userActions: () => chrome.i18n.getMessage("home_useractions"),
        userActionsText: () => chrome.i18n.getMessage("home_useractions_text"),
        settings: () => chrome.i18n.getMessage("home_settings"),
        settingsText: () => chrome.i18n.getMessage("home_settings_text"),
        settingsOnlineData: () => chrome.i18n.getMessage("home_settings_onlinedata"),
        settingsLanguage: () => chrome.i18n.getMessage("home_settings_language"),
        settingsAllowNotifications: () => chrome.i18n.getMessage("home_settings_allownotifications"),
        settingsPriceVariation: () => chrome.i18n.getMessage("home_settings_pricevariation"),
        settingsTimeout: () => chrome.i18n.getMessage("home_settings_timeout"),
        settingsScanNow: () => chrome.i18n.getMessage("home_settings_scannow"),
        otherInfo: () => chrome.i18n.getMessage("home_otherinfo"),
        otherInfoText: () => chrome.i18n.getMessage("home_otherinfo_text")
    }
}
