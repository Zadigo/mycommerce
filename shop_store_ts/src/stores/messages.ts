import _, { isUndefined } from 'lodash'
import { defineStore } from 'pinia'

declare type AppMessage = {
  id: number
  type: string
  message: string
  title: string
}

declare type RootState = {
  messageItems: AppMessage[]
};

const useMessages = defineStore("messages", {
  state: (): RootState => ({
    messageItems: [],
  }),
  getters: {
    /**
     * Returns if there are messages to display
     *
     * @returns {Boolean} Whether there are messages to display
     */
    hasMessages(): boolean {
      return this.messageItems.length > 0;
    },
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
    addMessage(type: string, title: string, message: string) {
      let id;
      const lastMessage = _.last(this.messageItems);

      if (isUndefined(lastMessage)) {
        id = 1;
      } else {
        id = lastMessage.id + 1;
      }

      if (this.messageItems.length > 2) {
        this.clearAll();
      }

      this.messageItems.push({
        id,
        type,
        title,
        message,
      });
    },
    /**
     * Adds an error message
     */
    addErrorMessage(title: string, message: string) {
      this.addMessage("error", title, message);
    },
    /**
     * Adds an info message
     *
     * @param {String} title The messgaae title
     * @param {String} message The message text
     */
    addInfoMessage(title: string, message: string) {
      this.addMessage("info", title, message);
    },
    /**
     * Adds an success message
     *
     * @param {String} title The messgaae title
     * @param {String} message The message text
     */
    addSuccessMessage(title: string, message: string) {
      this.addMessage("success", title, message);
    },
    /**
     * Special message for displaying a
     * network error e.g. 404, 500
     */
    addNetworkError() {
      this.addErrorMessage("Network error", "Failed to do whatever");
    },
    /**
     * Remove all messages
     */
    clearAll() {
      this.messageItems = [];
    },
    removeMessage(message: string) {
      const index = _.indexOf(this.messageItems, { id: message.id * 1 });
      this.messageItems.splice(index, 1);
    },
  },
});

export {
  useMessages
}
