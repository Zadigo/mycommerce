export async function createConnection(name: string): Promise<IDBDatabase> {
    return await new Promise<IDBDatabase>((resolve, reject) => {        
        try {
            console.log('Connect')
            const request = indexedDB.open(name)
    
            /**
             * The upgradeneeded event is fired when an attempt 
             * was made to open a database with a version number 
             * higher than its current version
             */
            request.onupgradeneeded = (_event) => {
                const db = request.result
    
                if (!db.objectStoreNames.contains('storage')) {
                    db.createObjectStore('storage')
                }
            }
    
            request.onsuccess = () => {
                console.log('request.onsucess')
                return resolve(request.result)
            }
            
            request.onerror = (e) => {
                console.log('request.onerror', e)
                return reject(request.error)
            }
        } catch (e) {
            console.log('Could not connect to IDB', e)
        }
    })
}

export function useIndexedDatabase(conn: Promise<IDBDatabase>) {
    async function get<T>(key: string): Promise<T> {
        const instance = await conn
        return new Promise((resolve, reject) => {
            const transaction = instance.transaction('storage', 'readonly')
            const store = transaction.objectStore('storage')
            const request = store.get(key)
            
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    }

    async function set<T>(key: string, value: T) {
        const instance = await conn
        return new Promise<void>((resolve, reject) => {
            const transaction = instance.transaction('storage', 'readwrite')
            const store = transaction.objectStore('storage')
            const request = store.put(value, key)

            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    }

    async function remove(key: string) {
        const instance = await conn
        return new Promise<void>((resolve, reject) => {
            const transaction = instance.transaction('storage', 'readwrite')
            const store = transaction.objectStore('storage')
            const request = store.delete(key)

            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    }
    
    return {
        get,
        remove,
        set
    }
}

export function useIDBStorage(conn: Promise<IDBDatabase>) {
    const instance = useIndexedDatabase(conn)

    return {
        getItem: async <T>(key: string): Promise<T> => {
            return await instance.get(key)
        },
        setItem: async (key: string, value: string) => {
            return await instance.set(key, value)
        },
        removeItem: async (key: string) => {
            return await instance.remove(key)
        }
    }
}
