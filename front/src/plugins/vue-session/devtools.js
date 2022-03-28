import { setupDevtoolsPlugin } from "@vue/devtools-api";

const STATETYPE = 'vue-session'
const INSPECTORID = 'vue-session'
const TIMELINEID = 'vue-session'

export function setupDevtools(Vue, instance) {
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
                    data: { label: label },
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
                        data: { label: label, data: instance._lastHistory },
                        groupId
                    }
                })
            }
        }
    }
    setupDevtoolsPlugin({
        id: 'vue-session',
        label: 'Vue Session',
        packageName: 'vue-session',
        homepage: 'http://example.com',
        componentStateTypes: [STATETYPE],
        enableEarlyProxy: true,
        Vue
    }, api => {

        devtoolsApi = api

        api.addInspector({
            id: 'vue-session',
            label: 'Vue Session',
            icon: 'storage'
        })

        api.addTimelineLayer({
            id: TIMELINEID,
            label: 'Vue Session',
            color: 0xff984f
        })

        api.on.getInspectorState((payload) => {
            if (payload.inspectorId == INSPECTORID) {
                payload.state = {
                    state: [
                        {
                            key: 'vue-session',
                            value: instance.data
                        }
                    ]
                }
            }
        })

        api.on.getInspectorTree((payload) => {
            if (payload.inspectorId == INSPECTORID) {
                payload.rootNodes = [
                    {
                        id: 'storage',
                        label: 'Storage'
                    }
                ]
            }
        })

        api.on.inspectComponent((payload) => {
            payload.instanceData.state.push({
                type: STATETYPE,
                key: '$session',
                value: instance.data
            })
        })

        setInterval(() => {
            api.sendInspectorState(INSPECTORID)
            api.notifyComponentUpdate()
        }, 3000)
    })

    return devtools
}

