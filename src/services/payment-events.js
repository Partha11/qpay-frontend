import api from './axios'

// EventSource cannot set merchant API-key headers. The same HttpOnly device
// cookie used by checkout authorizes this browser-only status channel.
export function watchPayment(sessionId, { onPayment, onOpen, onError, onExpired }) {
    const base = new URL(`${api.defaults.baseURL.replace(/\/$/, '')}/`, window.location.origin)
    const url = new URL(`payments/${encodeURIComponent(sessionId)}/events`, base)
    const source = new EventSource(url, { withCredentials: true })
    source.onopen = onOpen
    source.onerror = onError // Native EventSource reconnects; do not start polling.
    source.addEventListener('payment', (event) => {
        try { onPayment(JSON.parse(event.data)) } catch { onError() }
    })
    source.addEventListener('session-expired', () => {
        source.close()
        onExpired()
    })
    return () => source.close()
}
