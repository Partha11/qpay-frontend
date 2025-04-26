<script setup>
import { ref } from 'vue'
import { Button } from 'primevue'
import PaymentOption from './PaymentOption.vue'

const activeTab = ref('mobile_banking')
const tabs = ref([
    { value: 'mobile_banking', label: 'Mobile Banking' },
    { value: 'card_payment', label: 'Card Payment' },
])

const mobileBankingOptions = ref([
    {
        name: 'bKash',
        image: 'https://freelogopng.com/images/all_img/1656227518bkash-logo-png.png',
    },
    {
        name: 'Nagad',
        image: 'https://freelogopng.com/images/all_img/1683082228nagad-transparent-logo.png',
    },
    {
        name: 'Rocket',
        image: 'https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg',
    },
    {
        name: 'Upay',
        image: 'https://today.thefinancialexpress.com.bd/public/uploads/p9-Upay-Logo.jpg',
    },
])

const cardPaymentOptions = ref([
    {
        name: 'Visa',
        image: '/api/placeholder/120/80',
    },
    {
        name: 'Mastercard',
        image: '/api/placeholder/120/80',
    },
    {
        name: 'American Express',
        image: '/api/placeholder/120/80',
    },
    {
        name: 'UnionPay',
        image: '/api/placeholder/120/80',
    },
])

const emit = defineEmits(['paymentOptionSelected'])

const handlePaymentSelection = (paymentMethod) => {
    emit('paymentOptionSelected', paymentMethod)
}
</script>

<template>
    <div class="mb-6">
        <!-- Payment Method Toggle using PrimeVue Buttons -->
        <div class="flex gap-1 p-1 rounded-lg">
            <Button
                v-for="tab in tabs"
                :key="tab.value"
                @click="activeTab = tab.value"
                :label="tab.label"
                class="flex-1 border-none!"
                :class="
                    activeTab === tab.value
                        ? 'bg-teal-700! text-white'
                        : 'bg-gray-200! text-gray-700!'
                "
                :text="activeTab !== tab.value"
                :severity="activeTab === tab.value ? undefined : 'secondary'"
            />
        </div>

        <!-- Tab Content -->
        <div class="mt-4">
            <PaymentOption
                v-if="activeTab === 'mobile_banking'"
                :options="mobileBankingOptions"
                @selected="handlePaymentSelection"
            />
            <PaymentOption
                v-else-if="activeTab === 'card_payment'"
                :options="cardPaymentOptions"
                @selected="handlePaymentSelection"
            />
        </div>
    </div>
</template>
