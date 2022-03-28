/*
    A simple API to use the SessionStorage
    of the web browser with VueJS
*/

// import { setupDevtools } from './devtools'

const SESSION_ID_KEY = 'session-id'

var STORAGE = null

var createSessionKey = () => {
    return `sess:${Date.now()}`
}

var VueSession = {
    key: 'vue-session-key',
    // flash_key: 'vue-session-flash-key',

    setData(initialData) {
        STORAGE.setItem(VueSession.key, JSON.stringify(initialData))
    },

    getData() {
        return JSON.parse(STORAGE.getItem(VueSession.key))
    },

    sessionId() {
        // Return the curreent session ID
        return this.getData(VueSession.key)[SESSION_ID_KEY]
    },
}

var VueSessionApi = {

    init: (params) => {
        return {
            install: (Vue, options) => {
                // let devtools

                // Use the SessionStorage unless the
                // use specifies persistence which
                // will then shift to the localStorage
                STORAGE = window.sessionStorage
                if (options && 'persist' in options) {
                    STORAGE = localStorage
                }

                // Sets up the devtools in th browser for VueSession
                // devtools = setupDevtools(Vue, { instance: VueSession })

                params

                // var track = function (valueToResolve) {
                //     const trackEnd = devtools ? devtools.trackStart('$session') : null
                //     return new Promise(resolve => {
                //         setTimeout(() => {
                //             if (trackEnd) trackEnd()
                //             resolve(valueToResolve)
                //         }, 1000)
                //     })
                // }

                Vue.mixin({
                    data: () => ({
                        session: VueSession.getData()
                    })
                    // beforeCreate () {
                    //     setupDevtools(this, { intance: VueSession })
                    // }
                })

                Vue.prototype.$session = {
                    getAll() {
                        // Returns all the elements stored in the
                        // current session
                        var storedData = JSON.parse(STORAGE.getItem(VueSession.key))
                        return storedData || {}
                    },
        
                    set(key, value) {
                        // Session ID is our reserved key do
                        // do not allow it to be overriden
                        if (key == SESSION_ID_KEY) { return false }
                        
                        var storedData = this.getAll()
                        
                        if (!(SESSION_ID_KEY in storedData)) {
                            storedData['session-id'] = createSessionKey()
                            VueSession.setData(storedData)
                        }
                        storedData[key] = value
                        VueSession.setData(storedData)
                        track(storedData)
                    },
        
                    get(key) {
                        // Returns an item from the storage
                        return this.getAll()[key]
                    },
        
                    remove(key) {
                        // Remove a key from the storage
                        var storedData = this.getAll()
                        delete storedData[key]
                        VueSession.setData(storedData)
                    },
        
                    clear() {
                        // Clear the session storage
                        var storedData = this.getAll()
                        var newSession = { 'session-id': storedData[SESSION_ID_KEY] }
                        VueSession.setData(newSession)
                        track('cleared')
                    },
        
                    destroy() {
                        // Destroy the session
                        VueSession.setData({})
                    },
        
                    sessionId() {
                        // Return the curreent session ID
                        return self.getAll(VueSession.key)
                    },
        
                    renew(sessionKey) {
                        // Renew the session ID
                        typeof sessionKey === 'undefined' ? createSessionKey() : sessionKey
                        var storedData = this.getAll()
                        storedData[SESSION_ID_KEY] = sessionKey
                    },
        
                    isConfigured() {
                        // Determines whether VueSession is
                        // configured
                        return SESSION_ID_KEY in this.getAll()
                    }
                }

                // TODO: Show this ONLY in development mode
                // if (typeof window !== 'undefined' && window.__VUE__) {
                //     window.VueSession = VueSession
                //     // window.Vue.use(VueSession)
                // }
            }
        }
    }

}


function createVueSession(options) {
    return VueSessionApi.init(options)
}

export {
    createVueSession
}
