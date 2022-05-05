import { setupDevtoolsPlugin } from '@vue/devtools-api'

const STATETYPE = 'vue-project'
const INSPECTORID = 'vue-project'
const TIMELINEID = 'vue-project'

export function setupDevtools(app, vueProject) {
    let trackId = 0
    let devtoolsApi = null

    const devtools = {
        trackStart: (label) => {
            const groupId = 'track' + trackId++

            devtoolsApi.addTimelineEvent({
                layerId: TIMELINEID,
                event: {
                    time: Date.now(),
                    title: label,
                    data: { label },
                    groupId
                }
            })

            return () => {
                // End
                devtoolsApi.addTimelineEvent({
                    layerId: TIMELINEID,
                    event: {
                        time: Date.now(),
                        title: `${label} - finished`,
                        data: { label, done: true, data: vueProject._localStorageInstance.data },
                        groupId
                    }
                })
            }
        }
    }

    setupDevtoolsPlugin({
        id: 'vue-project',
        label: 'Vue Project',
        packageName: 'vue-project',
        homepage: null,
        componentStateTypes: [STATETYPE],
        enableEarlyProxy: true,
        app
    }, api => {
        devtoolsApi = api

        api.addInspector({
            id: 'vue-project',
            label: 'Vue Project',
            icon: 'stars'
        })

        api.on.getInspectorTree((payload) => {
            if (payload.inspectorId == INSPECTORID) {
                payload.rootNodes = [
                    {
                        id: 'localstorage',
                        label: 'LocalStorage'
                    }
                ]
            }
        })

        api.on.getInspectorState((payload) => {
            if (payload.inspectorId == INSPECTORID) {
                payload.state = {
                    state: [
                        {
                            key: 'data',
                            value: vueProject._localStorageInstance.data
                        }
                    ]
                }
            }
        })

        api.on.inspectComponent((payload) => {
            payload.instanceData.state.push({
                type: STATETYPE,
                key: '$localstorage',
                value: vueProject._localStorageInstance.data
            })
        })

        setInterval(() => {
            api.sendInspectorState(INSPECTORID)
            api.notifyComponentUpdate()
        }, 3000)
    })

    return devtools
}
