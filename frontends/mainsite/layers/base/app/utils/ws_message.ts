type DefaultDecodedData = {
  action: string
  error: string
  message: string
}

type DecodedData<R extends Record<string, unknown>, K extends keyof R> = DefaultDecodedData & Partial<R[ K ]>

export function useWWebsocketMessages2() {
  function encode<T extends Record<string, Record<string, unknown>[]>>(action: keyof T, ...args: T[ keyof T ]) {
    return JSON.stringify({ action, ...args[ 0 ] })
  }

  function decode<R extends Record<string, unknown>>(message: string) {
    /**
     * A decoder function that listens to messages from the websocket by matching the specified
     * action. The callback function will be called with the decoded data if the action matches,
     * or undefined if it doesn't match.
     * @param action - The action we want to decode from the message
     * @param callback - A callback function that will be called with the decoded data if the action matches, or undefined if it doesn't match
     */
    return function <K extends keyof R>(action: K, callback: (data: DecodedData<R, K> | undefined) => void) {
      try {
        const wsData = JSON.parse(message) as DecodedData<R, K>

        if (action === wsData.action) {
          callback(wsData)
        } else {
          callback(undefined)
        }
      } catch (error: unknown) {
        console.error(`Invalid message format: ${error}`)
        callback(undefined)
      }
    }
  }

  return {
    /**
     * Encode a message to be sent through the websocket. The message will be a JSON string with the specified action and data.
     * @param action - The action to be included in the message
     * @param args - The data to be included in the message
     */
    encode,
    /**
     * Return a new decoder function that can be used to decode messages from the websocket.
     * @param message - The message to be decoded
     */
    decode
  }
}
