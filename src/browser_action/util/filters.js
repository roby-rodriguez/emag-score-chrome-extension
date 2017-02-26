const filterBy = (list, property, value) =>
    list.filter(item =>
        (item[property] && item[property].toUpperCase().indexOf(value.toUpperCase()) > -1)
            || (item.pid.indexOf(value) > -1)
    )

export { filterBy }
