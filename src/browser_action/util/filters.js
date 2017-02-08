const filterBy = (list, property, value) =>
    list.filter(item =>
        item[property].indexOf(value) > -1
    )

export { filterBy }
