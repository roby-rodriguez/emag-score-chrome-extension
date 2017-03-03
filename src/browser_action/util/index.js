import moment from 'moment'
import { fromTimestamp } from "../../utils"

export const bounds = (history={}) => {
    // history we get here is already sorted
    const dates = Object.keys(history)
    return {
        from: fromTimestamp(dates[0]),
        until: fromTimestamp(dates[dates.length - 1])
    }
}

export const adaptedChartData = (history, from, until) =>
    Object.keys(history).reduce((result, timestamp) => {
        const date = fromTimestamp(timestamp),
            price = history[timestamp]
        if (from <= date && date <= until)
            result.push({
                dateRecorded: moment(date).format("DD-MM-YYYY"),
                price
            })
        return result
    }, [])
