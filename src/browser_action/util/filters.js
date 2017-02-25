// TODO add case insensitive + support pids
const filterBy = (list, property, value) =>
    list.filter(item =>
        item[property] && item[property].indexOf(value) > -1
    )

export { filterBy }
