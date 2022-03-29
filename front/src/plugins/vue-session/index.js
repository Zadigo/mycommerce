/*
    A simple API to use the SessionStorage
    of the web browser with VueJS
*/

// import { setupDevtools } from './devtools'

const VUE_SESSION_KEY = 'vue-session'


class VueSession {
    constructor(options) {
        let { persistent, initial } = options

        this.storage = sessionStorage
        // this._track = null
        this._history = []

        // TODO: Implement functionnalities for persistence
        // and for implementing initial data
        this.isPersistent = persistent ? true : false
        if (initial && typeof initial != 'object') {
            throw new Error('Initial should be a dictionnary')
        }
        this.initial = initial
    }

    get data() {
        return JSON.parse(this.storage.getItem(VUE_SESSION_KEY))
    }

    get _lastHistory() {
        return this._history[this._history.length - 1]
    }

    _precheck() {
        // Ensures that the session key above
        // is always present before doing any
        // operations
        if (!(VUE_SESSION_KEY in this.storage)) {
            var sessionData = { 'session-id': Date.now() }
            this.storage.setItem(VUE_SESSION_KEY, JSON.stringify(sessionData))
        }
    }

    _save(data) {
        this._precheck()
        this.storage.setItem(VUE_SESSION_KEY, JSON.stringify(data))
        // this._track(data)
        this._history.push(['save', data])
    }

    * iter() {
        yield* Object.values(this.data)
    }

    create(key, value) {
        this._precheck()
        var storedData = this.data
        storedData[key] = value
        this._save(storedData)
    }

    retrieve(key) {
        this._precheck()
        return this.data[key]
    }

    remove(key) {
        var storedData = this.data
        delete storedData[key]
        this._save(storedData)
    }

    renew() {
        // Fails silently if there is no
        // session in the storage
        try {
            var storedData = this.data
            storedData['session-id'] = Date.now()
            this.storage.setItem(VUE_SESSION_KEY, JSON.stringify(storedData))
        } catch {
            return false
        }
    }

    clear() {
        // Fails silently if there is no
        // session in the storage
        try {
            var sessionId = this.data['session-id']
            this.storage.setItem(VUE_SESSION_KEY, JSON.stringify({ 'session-id': sessionId }))
        } catch {
            return false
        }
    }

    contains(key) {
        return this.data ? key in this.data : false
    }

    destroy() {
        this.storage.clear()
    }

    getOrCreate(key, value) {
        this._precheck()

        var storedData = this.data

        if (!(key in storedData)) {
            this.create(key, value)
        }

        return storedData[key]
    }

    toggle(key) {
        var storedData = this.data
        if (typeof storedData[key] !== 'boolean') {
            console.warn('Only Boolean values can be toggled')
        }
        var result = !storedData[key]
        storedData[key] = result
        this._save(storedData)
        return { [`${key}`]: result }
    }

    // afterEach (func) {
    //     var result = func.call(this, this.storage, this.data)
    //     result
    // }

    install(Vue) {
        const self = this

        Vue.prototype.$session = self

        // Vue.mixin({
        //     beforeCreate() {
        //         setupDevtools(this, self)
                
        //         // var track = function (valueToResolve) {
        //         //     const trackEnd = devtools ? devtools.trackStart('$session') : null
        //         //     return new Promise(resolve => {
        //         //         setTimeout(() => {
        //         //             if (trackEnd) trackEnd()
        //         //             resolve(valueToResolve)
        //         //         }, 1000)
        //         //     })
        //         // }

        //         // self._track = track
        //     }
        // })
        
        window.VueSession = self
    }
}

function createVueSession(options) {
    return new VueSession(options)
}

export {
    VUE_SESSION_KEY,
    createVueSession
}
