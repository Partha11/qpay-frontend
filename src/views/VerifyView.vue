<!-- eslint-disable no-unused-vars -->
<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useLoadingStore } from '@/stores/loading'
import AppHeader from '@/components/header/AppHeader.vue'
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
        const url = `${import.meta.env.VITE_API_BASE_URL}/${import.meta.env.VITE_API_VERSION}/payments/${route.params.id}`
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
        const url = `${import.meta.env.VITE_API_BASE_URL}/${import.meta.env.VITE_API_VERSION}/payments/${route.params.id}/execute`
        isSubmitting.value = true
        loadingStore.show()
        const response = await axios.post(url, body, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })

        const data = response.data

        if (paymentData.value.webhook_url) {
            fetch(paymentData.value.webhook_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payment_id: route.params.id,
                    amount: body.amount,
                }),
            }).catch((e) => console.error('Webhook failed', e))
        }

        if (paymentData.value.success_url) {
            window.location = paymentData.value.success_url
        }
    } catch (error) {
        paymentAttempts.value++;
        console.log(paymentData.value.failure_url)
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
    } finally {
        setTimeout(() => {
            loadingStore.hide()
            isSubmitting.value = false
        }, 200)
    }
}

onMounted(() => {
    const { urlMethod } = getUrlParams()
    method.value = urlMethod
    fetchPaymentData()
})
</script>

<template>
    <div class="about">
        <BrandInfoWithoutTab :brand="paymentData.brand" :amount="paymentData.amount" :currency="paymentData.currency"
            :method="method" />
        <PaymentForm :method="method" :isSubmitting="isSubmitting" @submit="verifyPayment" />
        <PaymentInstruction :method="method" :amount="paymentData?.amount" :number="paymentData?.brand?.number" />
    </div>
</template>
