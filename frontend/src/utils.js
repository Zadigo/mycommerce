import _ from 'lodash'

function raiseError (functionName, message) {
  throw Error(`${functionName} - ${message}`)
}

/**
 * Adds an "id" attribute to each item
 * in a list of items
 * 
 * @param {Array} items - list of items
 * @returns {Array} indexed list of items
 * @throws Error
 * 
 */
function indexElements (items) {
  return _.map(items, (item, i) => {
    if (!(typeof item === 'object')) {
      throw Error(`indexElements - ${item} should be a dictionnary`)
    } else {
      item.id = i
      return item
    }
  })
}

/**
 * From a list of items, get the incremented
 * last "id" attribute
 * 
 * @param items - list of items
 * @returns {Number} item last id incremented by 1
 * @throws Error
 * 
 */
function incrementLastId (items) {
  const lastItem = _.last(items)

  if (!(typeof lastItem === 'object')) {
    throw Error(`incrementLastId - ${lastItem} should be a dictionnary`)
  }
  return lastItem.id + 1
}

/**
 * Read a user uploaded file
 * 
 * @param {File} file - a local file
 * @returns {String | ArrayBuffer} data url of the file
 *  
 */
function readFile (file) {
  let filePreview = null

  if (file && file[0]) {
    const reader = new FileReader()

    reader.onload = e => {
      filePreview = e.target.result
    }

    reader.readAsDataURL(file[0])
  }
  return filePreview
}

/**
 * Read multiple uploaded files
 * 
 * @param {Array} files - list of local files
 * @returns {Array} data url of the file
 *  
 */
function readMultipleFiles (files) {
  return files.map((file) => {
    return readFile(file)
  })
}

/**
 * Truncate a given text by k-length
 * 
 * @param {String} text - text to truncate
 * @param {Number} k - truncation value
 * @returns {String} truncated string
 *  
 */
function truncate (text, k = 28) {
  if (!(typeof text === 'string')) {
    raiseError('truncate', `${text} should be a string`)
  } else {
    return `${text.slice(0, k)}...`
  }
}

/**
 * Truncate a string based on it's length
 * 
 * @param {String} text - text to truncate
 * @param {Number} limit - length under which the string should be truncated
 * @param {Number} k - truncation value
 * @returns {String} non-truncated or truncated string
 *  
 */
function conditionalTruncate (text, limit, k) {
  if (text.length >= limit) {
    return truncate(text, k)
  } else {
    return text
  }
}

/**
 * From a given url, get the "limit" and "offset"
 * query parameters
 * 
 * @param {String} url - url to parse
 * @returns {String} limit and offset query parameters
 *  
 */
function buildLimitOffset (url, limit = 100, offset = 0) {
  if (url) {
    const instance = new URL(url)
    const potentialLimit = instance.searchParams.get('limit')
    const potentialOffset = instance.searchParams.get('offset')

    limit = potentialLimit || limit
    offset = potentialOffset || offset
  }
  return new URLSearchParams({ limit: limit, offset: offset })
}

/**
 * From a given url, get the "page"
 * query parameter
 * 
 * @param {String} url - url to parse
 * @param {Number} page - page number
 * @returns {String} limit and offset query parameters
 *  
 */
function getPageFromParams (url, page = 1) {
  if (url) {
    const instance = new URL(url)
    const potentialPage = instance.searchParams.get('page')
    page = potentialPage || 1
  }
  return new URLSearchParams({ page: page })
}

/**
 * Manage the items of a list by adding or removing non-existing
 * elements accordingly
 * 
 * @param {Array} items - list of items
 * @param {String | Number} item - string or number
 * @returns {Array} list of items
 * 
 */
function listManager (items, item) {
  if (items.includes(item)) {
    const index = _.indexOf(items, item)

    items.splice(index, 1)
  } else {
    items.push(item)
  }
  return items
}

/**
 * Based on a list of values, increase an index
 * by one if it's value is in the limits of the length
 * of the list of items
 * 
 * @param {Array} items - list of items
 * @param {Number} initialIndex - value to increment
 * @returns {Number} updated index
 * 
 */
function increaseIndex (items, initialIndex) {
  // Base on a list of items and an initial index,
  // increase the index by 1. If the new index is
  // out of bounds, return 0, or, the index of
  // the first element
  let newIndex = initialIndex + 1

  if (newIndex > items.length - 1) {
    newIndex = 0
  }
  return newIndex
}

/**
 * Based on a list of values, decrease an index
 * by one if it's value is in the limits of the length
 * of the list of items
 * 
 * @param {Array} items - list of items
 * @param {Number} initialIndex - value to increment
 * @returns {Number} updated index
 * 
 */
function decreaseIndex (items, initialIndex) {
  // Base on a list of items and an initial index,
  // increase the index by 1. If the new index is
  // out of bounds, return the index of the last
  // item of the list
  let newIndex = initialIndex - 1

  if (newIndex < 0) {
    newIndex = items.length - 1
  }
  return newIndex
}

/**
 * Based on a list of values, increase an index
 * by one if it's value is in the limits of the length
 * of the list of items
 * 
 * @param {Array} items - list of dictionnaries
 * @param {Object} initialItem - value to increment
 * @param {String} field - value to increment
 * @returns {Object} the dictionnary corresponding to the index
 * 
 */
function getPreviousItemFromList (items, initialItem, field) {
  // Returns the previous item from a given list based on the position
  // of an initial element
  const index = _.findIndex(items, [field, initialItem[field]])
  const newIndex = decreaseIndex(items, index)

  return items[newIndex]
}

/**
 * Based on a list of values, decrease an index
 * by one if it's value is in the limits of the length
 * of the list of items
 * 
 * @param {Array} items - list of dictionnaries
 * @param {Object} initialItem - value to increment
 * @param {String} field - value to increment
 * @returns {Object} the dictionnary corresponding to the index
 * 
 */
function getNextItemFromList (items, initialItem, field) {
  const index = _.findIndex(items, [field, initialItem[field]])
  const newIndex = increaseIndex(items, index)

  return items[newIndex]
}

/**
 * Search a list of dictionnaries based on a given
 * set of fields and return those that match
 * 
 * @param {String} search - value to search
 * @param {Array} items - list of items
 * @param {Array} fields - fields to search
 * @returns {Array} list of matching items
 * 
 */
function searchHelper (search, items, fields) {
  if (search) {
    return _.filter(items, (item) => {
      const truthArray = _.map(fields, (field) => {
        const itemValue = item[field]

        if (typeof itemValue === 'boolean') {
          return itemValue === search
        }

        if (typeof itemValue === 'string') {
          const lowercasedItem = item[field].toLowerCase()

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

/**
 * Based on the ID attribute of an element on the
 * page, scroll to that element
 * 
 * @param {String} elementId - id of the element on the page
 * 
 */
function scrollToSection (elementId) {
  document.getElementById(elementId).scrollIntoView()
}

/**
 * Scroll to the top of a page
 * 
 */
function scrollToTop () {
  window.scroll(0, 0)
}

function getAutoComplete (fieldName) {
  let autocomplete = null

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

function getFieldType (fieldName, defaultType) {
  let fieldType = null

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

/**
 * Loads a component under src/components
 * 
 * @param {String} component - component path
 * 
 */
function loadView (component) {
  return () => import(`./views/${component}.vue`)
}

/**
 * Loads a component under src/layouts
 * 
 * @param {String} component - component path
 * 
 */
function loadLayout (component) {
  return () => import(`./layouts/${component}.vue`)
}

/**
 * Loads a component under src/views
 * 
 * @param {String} component - component path
 * 
 */
function loadComponent (component) {
  return () => import(`./components/${component}.vue`)
}

/**
 * Capitalize the first letter of a string
 * 
 * @param {String} value - text to capitalize
 * @returns {String} capitalized text
 * 
 */
function capitalizeFirstLetter (value) {
  if (!value) { return value }
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * Capitalize the first letters of a string
 * see {@link capitalizeFirstLetter}
 * 
 * @param {String} value - text to capitalize
 * @returns {String} capitalized text
 * 
 */
function capitalizeLetters (value) {
  const tokens = value.split(' ')
  const result = tokens.map((token) => {
    return capitalizeFirstLetter(token)
  })

  return result.join(' ')
}

/**
 * Capitalize the first letters of a string
 * see {@link capitalizeFirstLetter}
 * 
 * @param {Number} value - value to format
 * @param {Boolean} negative - return the percentage in a negative format
 * @returns {String} formated text
 * 
 */
function formatAsPercentage (value, negative = false) {
  return negative ? `-${value}%` : `${value}%`
}

/**
 * Get the full url for a media content
 * 
 * @param {String} path - relative path of the media element
 * @returns {String} url
 * 
 */
function mediaUrl (path) {
  const rootUrl = process.env.rootUrl || 'http://127.0.0.1:8000'
  return new URL(path, rootUrl).toString()
}

/**
 * Get the percentage of the current
 * element that was scrolled
 * 
 * @param {Element} el - element on the page
 * @returns {Number} - percentage scrolled
 * 
 */
function getVerticalScrollPercentage (el) {
  const parent = el.parentNode
  return (el.scrollTop || parent.scrollTop) / (parent.scrollHeight - parent.clientHeight) * 100
}

/**
 * Quickly sort a list of items
 * 
 * @param {Array} items - list of items
 * @returns {Array} sorted list of a items
 * 
 */
function quickSort (items) {
  return items.sort((a, b) => {
    return a - b
  })
}

/**
 * Get the protocole for a websocket based
 * on th protocole of the current address
 * 
 * @returns {String} ws:// or wss://
 * 
 */
function getWebsocketProtocole () {
  const protocol = window.location.protocol
  return protocol === 'https' ? 'wss://' : 'ws://'
}

/**
 * Get the full address for a websocket
 * 
 * @returns {String} url
 * 
 */
function websocketRootAddress (path) {
  const protocol = getWebsocketProtocole()
  const host = process.env.HOST_ADDRESS || '127.0.0.1:8000'
  return new URL(path, protocol + host).toString()
}

/**
 * Create a new websocket instance
 * 
 * @param {String} path - path to use
 * @param {Object} listeners - onopen, onclose, onmessage and onerror
 * @param {WebSocket} using - the websocket class to use
 * @returns {WebSocket} websocket instance
 * 
 */
function createWebsocket (path, listeners = {}) {
  const socket = new WebSocket(websocketRootAddress(path))

  socket.onopen = listeners.onopen
  socket.onclose = listeners.onclose
  socket.onmessage = listeners.onmessage
  socket.onerror = listeners.onerror

  return socket
}

/**
 * Send a message to a websocket
 * 
 * @param {String} type - method for the websocket
 * @param {Object} items - dictionnary of items to send
 * @returns {String} url
 * 
 */
function socketSendMessage (type, items = {}) {
  return JSON.stringify({ type: type, ...items })
}

/**
 * Resolve a relative path to a full url
 * 
 * @param {String} path - path to resolve
 * @returns {String} url
 * 
 */
function rebuildPath (path) {
  const instance = new URL(path, window.location.href)
  return instance.toString()
}

/**
 * Check if a list of items has null values
 * 
 * @param {Array | Object} items - elements to evaluate
 * @returns {Boolean} true or false
 * 
 */
function hasNull (items) {
  if (typeof items === 'object') {
    items = Object.values(items)
  }

  return _.some(items, (item) => {
    return item === null || item === undefined || item === ''
  })
}

/**
 * Adds all the utils functions into Vue
 * 
 * @returns {Object} install object
 * 
 */
function createUtils () {
  return {
    install: (app) => {
      app.mixin({
        methods: {
          buildLimitOffset,
          capitalizeFirstLetter,
          capitalizeLetters,
          conditionalTruncate,
          createWebsocket,
          decreaseIndex,
          formatAsPercentage,
          getVerticalScrollPercentage,
          getPreviousItemFromList,
          getNextItemFromList,
          getAutoComplete,
          getFieldType,
          hasNull,
          indexElements,
          increaseIndex,
          incrementLastId,
          listManager,
          loadView,
          loadLayout,
          loadComponent,
          mediaUrl,
          readFile,
          readMultipleFiles,
          rebuildPath,
          scrollToSection,
          searchHelper,
          scrollToTop,
          socketSendMessage,
          truncate,
          websocketRootAddress,
          quickSort
        }
      })
    }
  }
}

export {
  buildLimitOffset,
  capitalizeFirstLetter,
  capitalizeLetters,
  conditionalTruncate,
  createWebsocket,
  decreaseIndex,
  formatAsPercentage,
  getVerticalScrollPercentage,
  getPreviousItemFromList,
  getNextItemFromList,
  getAutoComplete,
  getFieldType,
  getPageFromParams,
  hasNull,
  indexElements,
  increaseIndex,
  incrementLastId,
  listManager,
  loadView,
  loadLayout,
  loadComponent,
  mediaUrl,
  readFile,
  readMultipleFiles,
  rebuildPath,
  scrollToSection,
  searchHelper,
  scrollToTop,
  socketSendMessage,
  truncate,
  websocketRootAddress,
  quickSort,

  createUtils
}
