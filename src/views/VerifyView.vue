<!-- eslint-disable no-unused-vars -->
<script setup>
import axios from 'axios'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useLoadingStore } from '@/stores/loading'
import BrandInfoWithoutTab from '@/components/brand/BrandInfoWithoutTab.vue'
import PaymentForm from '@/components/payment/PaymentForm.vue'
import PaymentInstruction from '@/components/payment/instruction/PaymentInstruction.vue'

const MAX_ATTEMPTS = 3

const toast = useToast()
const route = useRoute()

const method = ref('')
const paymentData = ref({})
const isSubmitting = ref(false)
const paymentAttempts = ref(0)

const loadingStore = useLoadingStore()

let pollingInterval = null;

const startPollingPaymentStatus = () => {
    if (pollingInterval) return;

    pollingInterval = setInterval(async () => {
        try {
            const response = await axios.get(
                `/api/${import.meta.env.VITE_API_VERSION}/payments/${route.params.id}`,
                {
                    headers: {
                        'Accept': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            const payment = response.data;
            switch (payment.status) {
                case 'COMPLETED':
                    stopPolling(); // stop polling
                    window.location = payment.success_url;
                    break;
                case 'FAILED':
                    stopPolling();
                    window.location = payment.failure_url;
                    break;
            }
        } catch (err) {
            toast.add({
                severity: 'danger',
                summary: 'Error',
                detail: err,
                life: 3000,
            })
        } finally {
            setTimeout(() => {
                loadingStore.hide()
                isSubmitting.value = false
            }, 200)
        }
    }, 3000);
};

const stopPolling = () => {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
};

const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search)
    return {
        urlMethod: params.get('method') || '',
    }
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
        const url = `/api/${import.meta.env.VITE_API_VERSION}/payments/${route.params.id}`
        const response = await axios.get(
            url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        console.log(response.data)
        processApiData(response.data)
    } catch (error) {
        toast.add({
            severity: 'danger',
            summary: 'Error',
            detail: error,
            life: 3000,
        })
    }
}

const verifyPayment = async (body) => {
    if (!body) return
    try {
        const url = `/api/${import.meta.env.VITE_API_VERSION}/payments/${route.params.id}/execute`
        isSubmitting.value = true
        loadingStore.show()
        const response = await axios.post(url, body, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })

        const data = response.data

        switch (data.status) {
            case "COMPLETED":
                window.location = data.success_url
                break;
            case "FAILED":
                window.location = data.failure_url
                break;
            default:
                startPollingPaymentStatus();
                break;
        }
    } catch (error) {
        paymentAttempts.value++;
        setTimeout(() => {
            loadingStore.hide()
            isSubmitting.value = false
        }, 200)
        if (paymentAttempts.value >= MAX_ATTEMPTS && paymentData.value.failure_url) {
            window.location = paymentData.value.failure_url
        } else {
            toast.add({
                severity: 'danger',
                summary: 'Error',
                detail: `Payment failed (attempt ${paymentAttempts.value}/${MAX_ATTEMPTS})`,
                life: 3000,
            })
        }
    }
}

onMounted(() => {
    const { urlMethod } = getUrlParams()
    method.value = urlMethod
    fetchPaymentData()
})

onUnmounted(() => {
    stopPolling();
});
</script>

<template>
    <div class="about">
        <BrandInfoWithoutTab :brand="paymentData.brand" :amount="paymentData.amount" :currency="paymentData.currency"
            :method="method" />
        <PaymentForm :method="method" :isSubmitting="isSubmitting" @submit="verifyPayment" />
        <PaymentInstruction :method="method" :amount="paymentData?.amount" :number="paymentData?.brand?.number" />
    </div>
</template>
