import _, { isUndefined } from 'lodash'
import { defineStore } from 'pinia'

const useMessages = defineStore('messages', {
  state: () => ({
    messageItems: []
  }),
  getters: {
    /**
     * Returns if there are messages to display
     * 
     * @returns {Boolean} Whether there are messages to display 
     */
    hasMessages () {
      return this.messageItems.length > 0
    }
  },
  actions: {
    /**
     * Main function that adds a message to the
     * message container
     * 
     * @param {String} type The message type
     * @param {String} title The messgaae title 
     * @param {String} message The message text
     */
    addMessage (type, title, message) {
      let id
      const lastMessage = _.last(this.messageItems)

      if (isUndefined(lastMessage)) {
        id = 1
      } else {
        id = lastMessage.id + 1
      }

      if (this.messageItems.length > 2) {
        this.clearAll()
      }

      this.messageItems.push({
        id,
        type,
        title,
        message
      })
    },
    /**
     * Adds an error message
     * 
     * @param {String} title The messgaae title 
     * @param {String} message The message text
     */
    addErrorMessage (title, message) {
      this.addMessage('error', title, message)
    },
    /**
     * Adds an info message
     * 
     * @param {String} title The messgaae title 
     * @param {String} message The message text
     */
    addInfoMessage (title, message) {
      this.addMessage('info', title, message)
    },
    /**
     * Adds an success message
     * 
     * @param {String} title The messgaae title 
     * @param {String} message The message text
     */
    addSuccessMessage (title, message) {
      this.addMessage('success', title, message)
    },
    /**
     * Special message for displaying a
     * network error e.g. 404, 500 
     */
    addNetworkError () {
      this.addErrorMessage('Network error', 'Failed to do whatever')
    },
    /**
     * Remove all messages 
     */
    clearAll () {
      this.messageItems = []
    }
  }
})

export {
  useMessages
}
