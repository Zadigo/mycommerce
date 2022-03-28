
const SESSION_ID_NAME = 'session-id'
const VUE_SESSION_KEY_NAME = 'vue-session-key'


function createSessionValue () {
    return `sess:${Date.now()}`
}

class VueSession {
    constructor (options) {
        this._options = options

        // let { persistent } = options
        // if (!persistent) { this.storage = localStorage }

        this.storage = sessionStorage
        this._initializeStorage()
    }
    
    get data () {
        // Returns all the data stored under the
        // constant vue session key name
        return JSON.parse(this.storage.getItem(VUE_SESSION_KEY_NAME))
    }

    get sessionId () {
        return this.data[SESSION_ID_NAME]
    }
    
    _initializeStorage () {
        // Initialize the storage with
        // our main global storage key
        if (!this.data) {
            this.storage.setItem(VUE_SESSION_KEY_NAME, JSON.stringify({}))
        }
    }

    _checkSessionKey (data) {
        // Initialize a session if necessary
        // by creating a session ID under 
        // our main key
        if (!(SESSION_ID_NAME in data)) {
            var sessionKey = createSessionValue()

            data[SESSION_ID_NAME] = sessionKey
        }
        return data
    }

    _save (data, skipCheck) {
        // Saves items under the vue session key
        var dataToSave = ''

        if (!skipCheck) {
            dataToSave = JSON.stringify(this._checkSessionKey(data))
        } else {
            dataToSave = JSON.stringify(data)
        }
        this.storage.setItem(VUE_SESSION_KEY_NAME, dataToSave)
    }
    
    contains (key) {
        return key in this.data
    }

    set (key, value) {
        var storedData = this.data
        storedData[key] = value
        this._save(storedData)
        return this.data
    }

    getOrCreate(key, value) {
        var storedData = this.data
        var result = storedData[key]

        if (typeof result == 'undefined') {
            storedData[key] = value
            this._save(storedData)    
        } else {
            return result
        }
    }

    retrieve (key) {
        return this.data[key]
    }

    remove (key) {
        var storedData = this.data
        delete storedData[key]
        this._save(storedData)
    }

    clear () {
        // Remove the stored data from 
        // under our global session key
        var storedData = this.data
        var emptySession = { [`${ VUE_SESSION_KEY_NAME }`]: storedData[VUE_SESSION_KEY_NAME] }
        this._save(emptySession)
    }

    destroy () {
        this._save({}, true)
    }

    renew (value) {
        var sessionKey = typeof value === 'undefined' ? createSessionValue() : value
        var storedData = this.data
        storedData[SESSION_ID_NAME] = sessionKey
        this._save(storedData)
    }

    install (Vue, options) {
        options

        Vue.prototype.$session = this

        Vue.mixin({
            data: () => ({
                session: {
                    data: this.data
                }
            })
        })

        window.VueSession = this
    }
}

function createVueSession (options) {
    return new VueSession(options)
}

export {
    VUE_SESSION_KEY_NAME,
    createVueSession
}
