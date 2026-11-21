<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useLoadingStore } from '@/stores/loading'
import BrandInfoWithoutTab from '@/components/brand/BrandInfoWithoutTab.vue'
import PaymentForm from '@/components/payment/PaymentForm.vue'
import PaymentInstruction from '@/components/payment/instruction/PaymentInstruction.vue'
import api from '@/services/axios'
import { watchPayment } from '@/services/payment-events'

const toast = useToast()
const route = useRoute()
const loadingStore = useLoadingStore()
const paymentData = ref({})
const selectedMethod = ref({})
const method = ref('')
const submitting = ref(false)
const loaded = ref(false)
const expired = ref(false)
const reconnecting = ref(false)
const errorMessage = ref('')
const isSubmitting = computed(() => submitting.value || !loaded.value || expired.value ||
    !['PENDING', 'PARTIALLY_PAID'].includes(paymentData.value.status))
const remaining = computed(() => Number(paymentData.value.remaining_amount ?? paymentData.value.amount ?? 0).toFixed(2))
let stopEvents = () => {}
let mounted = true
let redirected = false

const finish = () => {
    const payment = paymentData.value
    if (redirected) return
    // PROCESSING means receipt funds matched, NOT merchant-confirmed success.
    if (payment.status === 'COMPLETED' && payment.success_url) {
        redirected = true
        stopEvents()
        window.location.assign(payment.success_url)
    } else if (payment.status === 'FAILED' && payment.failure_url) {
        redirected = true
        stopEvents()
        window.location.assign(payment.failure_url)
    } else if (['FAILED', 'REFUNDED', 'COMPLETED'].includes(payment.status)) {
        stopEvents()
    }
}

const applyPayment = (data) => {
    if (!mounted || Number(data.version ?? 0) < Number(paymentData.value.version ?? -1)) return
    if (data.id && paymentData.value.id && data.id !== paymentData.value.id) return
    const previous = paymentData.value.status
    // Execute and SSE have no brand payload: retain the initial checkout DTO.
    paymentData.value = { ...paymentData.value, ...data, brand: data.brand || paymentData.value.brand || {} }
    if (data.status === 'PARTIALLY_PAID' && previous !== 'PARTIALLY_PAID') {
        toast.add({ severity: 'info', summary: 'Partial payment received',
            detail: `Submit another receipt for the remaining ${remaining.value} ${paymentData.value.currency}.`, life: 5000 })
    }
    finish()
}

const verifyPayment = async (body) => {
    if (!body || isSubmitting.value) return
    submitting.value = true
    errorMessage.value = ''
    try {
        const response = await api.post(`/payments/${route.params.id}/execute`, body)
        applyPayment(response.data)
    } catch (error) {
        if (!mounted) return
        errorMessage.value = error.response?.data?.message || error.message || 'Unable to submit receipt. Please retry.'
        if ([401, 409].includes(error.response?.status) && errorMessage.value.includes('session')) {
            expired.value = true
            stopEvents()
        }
        toast.add({ severity: 'error', summary: 'Receipt submission failed', detail: errorMessage.value, life: 5000 })
    } finally {
        submitting.value = false
    }
}

onMounted(async () => {
    const params = new URLSearchParams(window.location.search)
    method.value = params.get('method') || ''
    loadingStore.show()
    try {
        const response = await api.get(`/payments/${route.params.id}`)
        if (!mounted) return
        loaded.value = true
        applyPayment(response.data)
        selectedMethod.value = paymentData.value.brand?.methods?.find((m) =>
            m.slug === method.value && m.type?.toLowerCase() === (params.get('type') || '')) || {}
        if (redirected || ['COMPLETED', 'FAILED', 'REFUNDED'].includes(paymentData.value.status)) return
        // Start after GET establishes the HttpOnly session-lock cookie.
        stopEvents = watchPayment(route.params.id, {
            onPayment: applyPayment,
            onOpen: () => { reconnecting.value = false },
            onError: () => { reconnecting.value = true },
            onExpired: () => {
                expired.value = true
                errorMessage.value = 'Invalid or expired payment session. Request a new payment link from the merchant.'
            },
        })
    } catch (error) {
        if (!mounted) return
        errorMessage.value = error.response?.data?.message || error.message || 'Failed to fetch payment info'
        toast.add({ severity: 'error', summary: 'Payment unavailable', detail: errorMessage.value, life: 5000 })
    } finally {
        loadingStore.hide()
    }
})

onUnmounted(() => {
    mounted = false
    stopEvents()
    loadingStore.hide()
})
</script>

<template>
    <div class="about">
        <BrandInfoWithoutTab :brand="paymentData.brand" :amount="remaining" :currency="paymentData.currency"
            :method="selectedMethod" />
        <div class="mb-4 p-4 rounded bg-teal-50" role="status" aria-live="polite" data-payment-status>
            <p v-if="expired">{{ errorMessage }}</p>
            <p v-else-if="paymentData.status === 'PROCESSING'">Payment received. Waiting for merchant verification…</p>
            <p v-else-if="paymentData.status === 'PARTIALLY_PAID'">Partial payment received. Remaining: {{ remaining }} {{ paymentData.currency }}. Submit another receipt below.</p>
            <p v-else-if="paymentData.status === 'COMPLETED'">Payment completed.</p>
            <p v-else-if="paymentData.status === 'FAILED'">Payment failed. Contact the merchant.</p>
            <p v-else-if="paymentData.status === 'REFUNDED'">Payment refunded. Contact the merchant.</p>
            <p v-else>Enter the transaction ID and sender phone number from your payment.</p>
            <p v-if="reconnecting && !expired">Live connection interrupted. Reconnecting automatically… If your link has expired, request a new one from the merchant.</p>
            <p v-if="errorMessage && !expired" role="alert">{{ errorMessage }}</p>
        </div>
        <PaymentForm :key="`${paymentData.id}-${paymentData.version}`" :method="method" :isSubmitting="isSubmitting" @submit="verifyPayment" />
        <PaymentInstruction :method="selectedMethod" :amount="remaining" />
    </div>
</template>
