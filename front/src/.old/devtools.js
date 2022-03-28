import { setupDevtoolsPlugin } from "@vue/devtools-api";

const STATETYPE = 'vue-session'
const INSPECTORID = 'vue-session'
const TIMELINEID = 'vue-session'

export function setupDevtools(Vue, instance) {
    let devtoolsApi = null
    let trackId = 0

    const devtools = {
        // This section allows use to track
        // events for the timeline
        // trackStart: (label, string) => {
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
                        data: { label, done: true, data: instance.instance.getData() },
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
        homepage: null,
        componentStateTypes: [STATETYPE],
        enableEarlyProxy: true,
        settings: {
            persistentStorage: {
                label: 'Persistent storage',
                type: 'boolean',
                defaultValue: false
            },
            sessionName: {
                label: 'Session name',
                type: 'text',
                defaultValue: 'session-id'
            }
        },
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

        api.on.getInspectorTree((payload) => {
            if (payload.inspectorId == INSPECTORID) {
                payload.rootNodes = [
                    {
                        id: 'root',
                        label: 'Root',
                        tags: [
                            {
                                label: instance.instance.sessionId(),
                                textColor: 0x000000,
                                backgroundColor: 0xff984f
                            }
                        ]
                    }
                ]
            }
        })

        api.on.getInspectorState((payload) => {
            if (payload.inspectorId == INSPECTORID) {
                if (payload.nodeId == 'root') {
                    payload.state = {
                        state: [
                            {
                                key: 'storedData',
                                value: instance.instance.getData()
                            }
                        ]
                    }
                }
            }
        })

        api.on.inspectComponent((payload) => {
            payload.instanceData.state.push({
                type: STATETYPE,
                key: '$session',
                value: instance.instance.getData()
            })
        })

        setInterval(() => {
            api.sendInspectorState(INSPECTORID)
            api.notifyComponentUpdate()
        }, 3000);
        
    })

    return devtools
}

