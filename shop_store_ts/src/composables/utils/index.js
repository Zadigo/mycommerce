import _ from 'lodash'
import { useRouter } from 'vue-router'

function raiseError (functionName, message) {
  throw new Error(`${functionName} - ${message}`)
}

export function scrollToTop () {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function useUtilities () {
  function hasNull (items) {
    let itemsValues = []

    if (typeof items === 'object') {
      itemsValues = Object.values(items)
    }

    return _.some(itemsValues, (item) => {
      return item === null || item === ""
    })
  }

  function incrementLastId (items) {
    var lastItem = _.last(items)
    if (!(typeof lastItem === 'object')) {
      raiseError('incrementLastId', `${lastItem} is not a dictionnary`)
      return null
    } else {
      return lastItem.id + 1
    }
  }

  function readFile (file) {
    var filePreview = null

    if (file && file[0]) {
      const reader = new FileReader

      reader.onload = e => {
        filePreview = e.target.result
      }

      reader.readAsDataURL(file[0])
    }
    return filePreview
  }

  function readMultipleFiles (files) {
    return files.map((file) => {
      return readFile(file)
    })
  }

  function truncate (text, k = 28) {
    if (!(typeof text === 'string')) {
      raiseError('truncate', `${text} should be a string`)
      return ''
    } else {
      return `${text.slice(0, k)}...`
    }
  }

  function conditionalTruncate (text, limit, k) {
    if (text.length >= limit) {
      return truncate(text, k)
    } else {
      return text
    }
  }

  function listManager (items, item) {
    if (items.includes(item)) {
      const index = _.indexOf(items, item)
      items.splice(index, 1)
    } else {
      items.push(item)
    }
    return items
  }

  function increaseIndex (items, initialIndex) {
    var newIndex = initialIndex + 1

    if (newIndex > items.length - 1) {
      newIndex = 0
    }
    return newIndex
  }

  function decreaseIndex (items, initialIndex) {
    var newIndex = initialIndex - 1

    if (newIndex < 0) {
      newIndex = items.length - 1
    }
    return newIndex
  }

  function scrollToSection (elementId) {
    document.getElementById(elementId).scrollIntoView()
  }

  function capitalizeFirstLetter (value) {
    if (!value) {
      return value
    }
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  function capitalizeLetters (value) {
    var tokens = value.split(" ")
    var result = tokens.map((token) => {
      return capitalizeFirstLetter(token)
    })

    return result.join(" ")
  }

  function formatAsPercentage (value, negative = false) {
    return negative ? `-${value}%` : `${value}%`
  }

  function getVerticalScrollPercentage (el) {
    var parent = el.parentNode
    return (el.scrollTop || parent.scrollTop) / (parent.scrollHeight - parent.clientHeight) * 100
  }

  function quickSort (items, ascending = true) {
    return items.sort((a, b) => {
      return ascending ? a - b : b - a
    })
  }

  function debounce (fn, delay) {
    let timer;
    
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }


  return {
    debounce,
    capitalizeFirstLetter,
    capitalizeLetters,
    conditionalTruncate,
    decreaseIndex,
    formatAsPercentage,
    getVerticalScrollPercentage,
    hasNull,
    incrementLastId,
    increaseIndex,
    listManager,
    quickSort,
    readFile,
    readMultipleFiles,
    scrollToSection,
    scrollToTop,
    truncate
  }
}

export function useUrls () {
  function rebuildPath (path) {
    var instance = new URL(path, window.location.href)
    return instance.toString()
  }

  function mediaUrl (path) {
    var rootUrl = import.meta.env.BASE_URL || 'http://127.0.0.1:8000'
    // if (!path && useDefault) {
    //   return require('@/assets/placeholder.png')
    // }
    return new URL(path, rootUrl).toString()
  }

  function buildLimitOffset (url, limit = 100, offset = 0) {
    let defaultLimit = 100
    let defaultOffset = 0

    if (url) {
      const instance = new URL(url)
      const potentialLimit = instance.searchParams.get('limit')
      const potentialOffset = instance.searchParams.get('offset')

      defaultLimit = potentialLimit || limit
      defaultOffset = potentialOffset || offset
    }

    return new URLSearchParams({ limit: defaultLimit, offset: defaultOffset })
  }

  function getPageFromParams (url, page = 1) {
    let defaultPage = 1

    if (url) {
      const instance = new URL(url)
      const potentialPage = instance.searchParams.get('page')
      defaultPage = potentialPage || page
    }
    return new URLSearchParams({ page: defaultPage })
  }

  return {
    buildLimitOffset,
    getPageFromParams,
    mediaUrl,
    rebuildPath
  }
}

export function useAxiosUtilities () {
  const router = useRouter()

  function handleAxiosError (e) {
    if (e.response?.status === 404) {
      router.push({ name: 'not_found' });
    } else {
      console.error("An error occurred", e.message);
    }
  }
  
  return {
    handleAxiosError
  }
}