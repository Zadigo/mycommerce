var messagesModule = {
    state: () => ({
        messages: []
    }),
    mutations: {
        addMessage (state, message) {
            state.messages.push(message)
        },
        clearMessages (state) {
            state.messages = []
        }
    },
    actions: {
        addErrorMessage ({ commit }, payload) {
            // Create a new error message
            commit('addMessage', { type: 'danger', content: payload })
        },
        addSuccessMessage({ commit }, payload) {
            // Create a new success message
            commit('addMessage', { type: 'success', content: payload })
        }
    },
    getters: {
        hasMessages (state) {
            return state.messages.length > 0
        }
    }
}

export default messagesModule
