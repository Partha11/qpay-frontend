<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useLoadingStore } from '@/stores/loading'
import BrandInfoWithoutTab from '@/components/brand/BrandInfoWithoutTab.vue'
import PaymentForm from '@/components/payment/PaymentForm.vue'
import PaymentInstruction from '@/components/payment/instruction/PaymentInstruction.vue'
import api from '@/services/axios' // Assuming you created the centralized axios instance

const MAX_ATTEMPTS = 3
const POLLING_INTERVAL_MS = 3000
const POLLING_TIMEOUT_MS = 120000 // Stop polling after 2 minutes

const toast = useToast()
const route = useRoute()
const loadingStore = useLoadingStore()

const method = ref('')
const methodType = ref('')
const selectedMethod = ref({})
const paymentData = ref({})
const isSubmitting = ref(false)
const paymentAttempts = ref(0)

// Polling state
let pollingInterval = null
let pollingTimeout = null

const stopPolling = () => {
    if (pollingInterval) {
        clearInterval(pollingInterval)
        pollingInterval = null
    }
    if (pollingTimeout) {
        clearTimeout(pollingTimeout)
        pollingTimeout = null
    }
}

const startPollingPaymentStatus = () => {
    // 1. Prevent multiple polling loops
    if (pollingInterval) return

    // 2. Ensure UI stays in "Loading" state during polling
    isSubmitting.value = true
    loadingStore.show()

    // 3. Set a safety timeout to stop polling eventually (e.g. 2 mins)
    pollingTimeout = setTimeout(() => {
        stopPolling()
        loadingStore.hide()
        isSubmitting.value = false
        toast.add({
            severity: 'warn',
            summary: 'Timeout',
            detail: 'Payment verification timed out. Please check your status manually.',
            life: 5000
        })
    }, POLLING_TIMEOUT_MS)

    // 4. Start the interval
    pollingInterval = setInterval(async () => {
        try {
            const response = await api.get(`/payments/${route.params.id}`)
            const payment = response.data

            if (payment.amount) paymentData.value.status = payment.status

            switch (payment.status) {
                case 'PROCESSING':
                    stopPolling()
                    window.location = payment.success_url
                    break
                case 'FAILED':
                    stopPolling()
                    window.location = payment.failure_url
                    break
            }
        } catch (err) {
            console.error('Polling check failed:', err)
        }
    }, POLLING_INTERVAL_MS)
}

const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search)
    return {
        urlMethod: params.get('method') || '',
        urlType: params.get('type') || '',
    }
}

const findSelectedMethod = () => {
    if (!paymentData.value?.brand?.methods) return null

    return paymentData.value.brand.methods.find(
        (m) => m.slug === method.value && m.type?.toLowerCase() === methodType.value
    )
}

const processApiData = (data) => {
    paymentData.value = data
    paymentData.value.amount = paymentData.value?.amount?.toFixed(2) ?? '0.00'
    paymentData.value.currency = paymentData.value?.currency ?? 'BDT'
    paymentData.value.status = paymentData.value?.status ?? 'PENDING'
    paymentData.value.metadata = paymentData.value?.metadata ?? {}
    paymentData.value.brand = paymentData.value?.brand ?? {}
}

const fetchPaymentData = async () => {
    try {
        loadingStore.show()
        const url = `/payments/${route.params.id}`
        const response = await api.get(url)
        processApiData(response.data)
    } catch (error) {
        toast.add({
            severity: 'danger',
            summary: 'Error',
            detail: error.message || 'Failed to fetch payment info',
            life: 3000,
        })
    } finally {
        loadingStore.hide()
    }
}

const verifyPayment = async (body) => {
    if (!body) return

    stopPolling()

    try {
        const url = `/payments/${route.params.id}/execute`
        isSubmitting.value = true
        loadingStore.show()

        const response = await api.post(url, body)
        const data = response.data

        switch (data.status) {
            case "PROCESSING":
                window.location = data.success_url
                break
            case "FAILED":
                window.location = data.failure_url
                break
            default:
                startPollingPaymentStatus()
                break
        }
    } catch (error) {
        paymentAttempts.value++

        loadingStore.hide()
        isSubmitting.value = false

        if (paymentAttempts.value >= MAX_ATTEMPTS && paymentData.value.failure_url) {
            window.location = paymentData.value.failure_url
        } else {
            const msg = error.response?.data?.message || error.message || 'Unknown error'
            toast.add({
                severity: 'danger',
                summary: 'Error',
                detail: msg,
                life: 3000,
            })
        }
    }
}

onMounted(async () => {
    const { urlMethod, urlType } = getUrlParams()
    method.value = urlMethod
    methodType.value = urlType
    await fetchPaymentData()
    selectedMethod.value = findSelectedMethod()
})

onUnmounted(() => {
    stopPolling()
})
</script>

<template>
    <div class="about">
        <BrandInfoWithoutTab :brand="paymentData.brand" :amount="paymentData.amount" :currency="paymentData.currency"
            :method="selectedMethod" />
        <PaymentForm :method="method" :isSubmitting="isSubmitting" @submit="verifyPayment" />
        <PaymentInstruction
            :method="selectedMethod"
            :amount="paymentData?.amount" />
    </div>
</template>
