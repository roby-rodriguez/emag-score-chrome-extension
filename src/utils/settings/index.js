const adapt = (settings, responseCallback) => {
    return {
        onlineData: settings.general.onlineData,
        caching: settings.general.caching,
        timeout: settings.scan.timeout,
        notify: settings.notifications.allow,
        variationType: settings.notifications.priceVariation,
        responseCallback
    }
}

const clean = syncStore => {
    delete syncStore.lastCheck
    delete syncStore.settings
    return syncStore
}

export { adapt, clean }
