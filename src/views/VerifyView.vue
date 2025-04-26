<!-- eslint-disable no-unused-vars -->
<script setup>
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
        const response = await fetch(
            `http://192.168.50.174:3000/api/v1/payments/${route.params.id}`,
            {
                method: 'GET',
                mode: 'cors',
            },
        )

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message)
        }
        processApiData(data)
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
        isSubmitting.value = true
        loadingStore.show()
        const response = await fetch(
            `http://192.168.50.174:3000/api/v1/payments/${route.params.id}/execute`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            },
        )
        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message)
        }

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
        <BrandInfoWithoutTab :merchant="paymentData.merchant" :amount="paymentData.amount"
            :currency="paymentData.currency" :method="method" />
        <PaymentForm :merchant="paymentData.merchant" :amount="paymentData?.amount" :currency="paymentData?.currency"
            :method="method" :isSubmitting="isSubmitting" @submit="verifyPayment" />
        <PaymentInstruction :method="method" :amount="paymentData?.amount" :number="paymentData?.merchant?.number" />
    </div>
</template>
