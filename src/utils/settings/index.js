const adapt = (settings, responseCallback) => {
    return {
        timeout: settings.scan.timeout,
        notify: settings.notifications.allow,
        variationType: settings.notifications.priceVariation,
        responseCallback
    }
}

export { adapt }
