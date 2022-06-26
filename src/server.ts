type Listener = (payload: any) => void

let conn: WebSocket

const listeners: { [type: string]: Listener[] } = {}

const server = {
    /**
     * Opens a socket to the specified address
     *
     * @param {string} addr - The server address
     */
    connect(addr: string) {
        conn = new WebSocket(addr)

        // Notifies listeners when messages are received from server
        conn.onmessage = function(message: MessageEvent) {
            const data = JSON.parse(message.data)
            if (data) {
                server._notify(data.type, data.payload)
            }
        }
    },

    /**
     * Closes socket connection
     */
    close() {
        conn.close()
    },

    /**
     * Sends an event to server
     *
     * @param {string} type - The event type
     * @param {any} payload - The payload to send
     */
    send(type: string, payload: any = null) {
        conn.send(JSON.stringify({ type, payload }))
    },

    /**
     * Registers a callback for server responses
     *
     * @param {string} type - The event type to watch
     * @param {function} listener - The callback to execute when the event is received from server
     */
    on(type: string, listener: Listener) {
        if (!listeners[type]) {
            listeners[type] = []
        }
        listeners[type].push(listener)
    },

    /**
     * Executes all registered listeners for a given event type
     *
     * @param {string} type - The event type received from server
     * @param {object} payload - The payload received from server
     */
    _notify(type: string, payload: Record<string, any>) {
        if (listeners[type]) {
            for (const listener of listeners[type]) {
                listener(payload)
            }
        }
    }
}

export default server
