import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        visible: false,
        message: 'Loading...',
        subMessage: 'Please wait',
    }),
    actions: {
        show(options = {}) {
            this.visible = true
            this.message = options.message || 'Loading...'
            this.subMessage = options.subMessage || 'Please wait'
        },
        hide() {
            this.visible = false
        },
        setMessages({ message, subMessage }) {
            if (message) this.message = message
            if (subMessage) this.subMessage = subMessage
        },
    },
})
