// var _ = require('lodash')

var messagesModule = {
    state: () => ({
        messages: []
    }),

    mutations: {
        addMessage(state, message) {
            state.messages.push(message)
        },

        clearMessage(state, index) {
            state.messages = state.messages.splice(0, index)
        },

        clearMessages(state) {
            state.messages = []
        }
    },
    
    actions: {
        addErrorMessage({ commit }, payload) {
            // Create a new error message
            commit('addMessage', { type: 'error', content: payload })
        },

        addSuccessMessage({ commit }, payload) {
            // Create a new success message
            commit('addMessage', { type: 'success', content: payload })
        }
    },

    getters: {
        hasMessages(state) {
            return state.messages.length > 0
        }
    }
}

export default messagesModule
