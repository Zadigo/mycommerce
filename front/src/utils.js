import _ from 'lodash'

function indexElements(items) {
    return _.map(items, (item, i) => {
        item['id'] = i
        return item
    })
}

function incrementLastId(items) {
    var lastItem = _.last(items)
    return lastItem['id'] + 1
}

function readFile(file) {
    var filePreview = null

    if (file && file[0]) {
        let reader = new FileReader

        reader.onload = e => {
            filePreview = e.target.result
        }
        
        reader.readAsDataURL(file[0])
    }
    return filePreview
}

function readMultipleFiles(files) {
    return _.map(files, (file) => {
        return readFile(file)
    })
}

function truncate(value) {
    return `${value.slice(0, 28)}...`
}

function buildLimitOffset(url) {
    // With an url like this http://example.com?limit=100&offset=10,
    // try to rebuild query params with the provided limit
    // and offset. If not default.
    var limit = 100
    var offset = 0

    if (url) {
        var instance = new URL(url)
        var potentialLimit = instance.searchParams.get('limit')
        var potentialOffset = instance.searchParams.get('offset')

        limit = potentialLimit ? potentialLimit : limit
        offset = potentialOffset ? potentialOffset : offset
    }

    return new URLSearchParams({ limit: limit, offset: offset })
}

function limitAndOffsetAsParams(limit, offset) {
    return new URLSearchParams({ limit: limit, offset: offset })
}

function listManager(items, itemId) {
    // A helper function that allows managing
    // items in a list by removing or pushing
    // them depending on whether they are in
    // the list or not
    if (items.includes(itemId)) {
        var index = _.indexOf(items, itemId)
        items.splice(index, 1)
    } else {
        items.push(itemId)
    }
    return items
}

function increaseIndex(items, initialValue) {
    var newIndex = initialValue + 1
    if (initialValue > items.length) {
        initialValue = 0
    }
    return newIndex
}

function decreaseIndex(items, initialValue) {
    var newIndex = initialValue - 1
    if (initialValue < 0) {
        initialValue = items.length
    }
    return newIndex
}

export {
    indexElements,
    incrementLastId,
    readFile,
    readMultipleFiles,
    truncate,
    buildLimitOffset,
    listManager,
    limitAndOffsetAsParams,
    increaseIndex,
    decreaseIndex
}
