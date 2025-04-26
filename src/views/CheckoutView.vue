<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { formatCurrency } from '@/utils/formatters'
import { useLoadingStore } from '@/stores/loading'
import BrandInfo from '@/components/brand/BrandInfo.vue'
import PaymentMethod from '@/components/payment/PaymentMethod.vue'
import TransactionDetail from '@/components/tabs/TransactionDetail.vue'
import SupportDetail from '@/components/tabs/SupportDetail.vue'
import PaymentBar from '@/components/bottombar/PaymentBar.vue'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const activeTab = ref('payment')
const paymentData = ref({})

const loadingStore = useLoadingStore()

const processApiData = (data) => {
    paymentData.value.amount = data?.amount?.toFixed(2) ?? '0.00'
    paymentData.value.currency = data?.currency ?? 'BDT'
    paymentData.value.status = data?.status ?? 'PENDING'
    paymentData.value.metadata = data.metadata ?? {}
    paymentData.value.brand = data.brand ?? {}
}

const fetchPaymentData = async () => {
    try {
        loadingStore.show();
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/${import.meta.env.VITE_API_VERSION}/payments/${route.params.id}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(response.data)
        processApiData(response.data);
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;

        toast.add({
            severity: 'danger',
            summary: 'Error',
            detail: errorMessage,
            life: 3000,
        });
    } finally {
        loadingStore.hide();
    }
}

const handlePaymentSelection = (paymentMethod) => {
    // Redirect to payment details page with parameters
    const verifyUrl = `/verify/${encodeURIComponent(route.params.id)}?method=${encodeURIComponent(paymentMethod)}`
    router.push(verifyUrl)
}

const handlePayNow = () => {
    toast.add({
        severity: 'info',
        summary: 'Information',
        detail: 'Please select a payment method above to continue.',
        life: 3000,
    })
}

onMounted(() => {
    fetchPaymentData()
})
</script>

<template>
    <BrandInfo :brand="paymentData.brand" @tabChange="activeTab = $event" />
    <PaymentMethod v-if="activeTab === 'payment'" @paymentOptionSelected="handlePaymentSelection" />
    <TransactionDetail v-if="activeTab === 'details'" :metadata="paymentData.metadata" :amount="paymentData.amount" />
    <SupportDetail v-if="activeTab === 'support'" :brand="paymentData.brand" />
    <PaymentBar :totalAmount="formatCurrency(paymentData?.amount ?? 0, paymentData.currency ?? 'BDT')"
        @payNowClicked="handlePayNow" />
</template>
