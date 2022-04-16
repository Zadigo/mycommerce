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

export {
    indexElements,
    incrementLastId,
    readFile,
    readMultipleFiles,
    truncate
}
