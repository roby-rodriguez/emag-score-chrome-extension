const adapt = settings => {
    return {
        timeout: settings.scan.timeout,
        notify: settings.notifications.allow,
        variationType: settings.notifications.priceVariation
    }
}

export { adapt }
