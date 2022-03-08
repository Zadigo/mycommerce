import { setupDevtoolsPlugin } from '@vue/devtools-api'

const INSPECTOR_ID = 'vue-site-analytics'

export function setupDevtools(app) {
    setupDevtoolsPlugin({
        id: 'vue-site-analytics',
        label: 'Vue Site Analytics',
        packageName: 'vue-site-analytics',
        homepage: 'http://example.com',
        app
    }, api => {
        api.addInspector({
            id: INSPECTOR_ID,
            label: 'Vue Site Analytics',
            icon: 'pets',
        })
    })
}
