import _ from 'lodash'
import Vue from 'vue'

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

function conditionalTruncate(value, limit, k) {
    if (value.length >= limit) {
        return truncate(value, k)
    } else {
        return value
    }
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

function increaseIndex(items, initialIndex) {
    // Base on a list of items and an initial index,
    // increase the index by 1. If the new index is
    // out of bounds, return 0, or, the index of
    // the first element
    var newIndex = initialIndex + 1

    if (newIndex > items.length - 1) {
        newIndex = 0
    }
    return newIndex
}

function decreaseIndex(items, initialIndex) {
    // Base on a list of items and an initial index,
    // increase the index by 1. If the new index is
    // out of bounds, return the index of the last
    // item of the list
    var newIndex = initialIndex - 1

    if (newIndex < 0) {
        newIndex = items.length - 1
    }
    return newIndex
}

function getPreviousItemFromList(items, initialItem, field, callback) {
    // Returns the previous item from a given list based on the position
    // of an initial element
    var index = _.findIndex(items, [field, initialItem[field]])
    var newIndex = decreaseIndex(items, index)

    if (typeof callback === 'function') {
        callback.call(Vue, { newIndex: newIndex, item: items[newIndex] })
        // callback({ newIndex: newIndex, item: items[newIndex] })
    }

    return items[newIndex]
}

function getNextItemFromList(items, initialItem, field, callback) {
    // Returns the next item from a given list based on the position
    // of an initial element
    var index = _.findIndex(items, [field, initialItem[field]])
    var newIndex = increaseIndex(items, index)

    if (typeof callback === 'function') {
        callback.call(Vue, { newIndex: newIndex, item: items[newIndex] })
        // callback({ newIndex: newIndex, item: items[newIndex]})
    }

    return items[newIndex]
}

function searchHelper(search, items, fields) {
    // A quick helper function that allows us to
    // quickly filter a list of dict items based on
    // some given fields
    if (search) {
        return _.filter(items, (item) => {
            var truthArray = _.map(fields, (field) => {
                var itemValue = item[field]
                
                if (typeof itemValue === 'boolean') {
                    return itemValue === search
                }
                
                if (typeof itemValue === 'string') {
                    var lowercasedItem = item[field].toLowerCase()
                    
                    return itemValue === search || itemValue.includes(search) || lowercasedItem.includes(search) || lowercasedItem === search
                }

                if (typeof itemValue === 'number') {
                    return itemValue === search || itemValue.includes(search)
                }
                
                return false
            })
            return _.every(truthArray)
        })
    } else {
        return items
    }
}

function scrollToSection(elementId) {
    // Based on the ID attribute of an element on the
    // page, scroll to that element
    document.getElementById(elementId).scrollIntoView()
}

function getAutoComplete(fieldName) {
    var autocomplete = null

    switch (fieldName) {
        case fieldName === 'password':
            autocomplete = 'current-password'
            break

        case fieldName === 'password1':
        case fieldName === 'password2':
            autocomplete = 'new-password'
            break
    
        default:
            autocomplete = fieldName
            break
    }

    return autocomplete
}

function getFieldType(fieldName, defaultType) {
    var fieldType = null

    switch (fieldType) {
        case fieldName === 'password1':
        case fieldName === 'password2':
            fieldType = 'password'
            break

        case fieldName === 'telephone':
            fieldType = 'tel'
            break    

        default:
            fieldType = defaultType || 'text'
            break
    }

    return fieldType
}

function loadView(component) {
    return () => import(`@/views/${component}.vue`)
}

function loadLayout(component) {
    return () => import(`@/layouts/${component}.vue`)
}

function loadComponent(name) {
    return () => import(`@/components/${name}.vue`)
}

export {
    buildLimitOffset,
    conditionalTruncate,
    decreaseIndex,
    getPreviousItemFromList,
    getNextItemFromList,
    getAutoComplete,
    getFieldType,
    indexElements,
    increaseIndex,
    incrementLastId,
    listManager,
    limitAndOffsetAsParams,
    loadView,
    loadLayout,
    loadComponent,
    readFile,
    readMultipleFiles,
    scrollToSection,
    searchHelper,
    truncate
}
