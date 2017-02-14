import moment from 'moment'

export const bounds = history => {
    // TODO maybe sort array first
    const dates = Object.keys(history)
    return {
        first: dates[0],
        last: dates[dates.length - 1]
    }
}

export const adaptedChartData = (history, from, until) =>
    Object.keys(history).reduce((result, dateRecorded) => {
        const date = moment(dateRecorded, "DD-MM-YYYY"),
            price = history[dateRecorded]
        if (from <= date && date <= until)
            result.push({
                dateRecorded,
                price
            })
        return result
    }, [])
