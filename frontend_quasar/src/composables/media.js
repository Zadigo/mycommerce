export function useMedia () {
  function djangoMediaUrl (path, prefix = false) {
    let url
    let newPath = path

    if (prefix) {
      newPath = `/media/${path}`
    }

    if (process.env.DEV) {
      url = new URL(newPath, process.env.DEVELOPMENT_URL)
    } else {
      url = new URL(newPath, process.env.PRODUCTION_URL)
    }
    return url.toString()
  }
  
  return {
    djangoMediaUrl
  }
}
