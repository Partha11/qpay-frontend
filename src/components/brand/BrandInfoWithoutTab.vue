<script setup>
import { ref } from 'vue'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps({
    brand: {
        type: Object,
        default: null,
    },
    amount: {
        type: String,
        default: '0.00',
    },
    currency: {
        type: String,
        default: 'BDT',
    },
    method: {
        type: String,
        default: null,
    },
})
const defaultLogoUrl = ref(
    'https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg',
)
</script>

<template>
    <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="flex items-center mb-4">
            <img
                :src="brand?.logo ?? defaultLogoUrl"
                alt="Brand Logo"
                class="w-12 h-12 rounded-full object-cover ring-2 ring-teal-50 mr-4"
            />
            <div>
                <h2 class="font-bold text-gray-800">{{ brand?.name ?? 'N/A' }}</h2>
                <p class="text-sm text-gray-500">Payment to: {{ brand?.number ?? 'N/A' }}</p>
            </div>
        </div>

        <div class="border-t border-gray-100 pt-4">
            <div class="flex justify-between items-center space-y-1">
                <span class="text-md text-gray-600">Amount to pay:</span>
                <span class="text-md text-teal-600 font-bold">{{
                    formatCurrency(props.amount, props.currency)
                }}</span>
            </div>
            <div class="flex justify-between items-center mt-1">
                <span class="text-md text-gray-600">Payment method:</span>
                <span class="text-md font-medium text-gray-700">{{ props.method ?? 'N/A' }}</span>
            </div>
        </div>
    </div>
</template>
