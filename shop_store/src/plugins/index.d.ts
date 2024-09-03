import { App } from 'vue'

declare type ReturnObject = {
    install(app: App): void
}

declare function installPlugins(): ReturnObject
