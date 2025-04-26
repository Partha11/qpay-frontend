<script setup>
import { Button } from 'primevue'

const emit = defineEmits(['payNowClicked'])

defineProps({
    totalAmount: {
        type: String,
        required: true,
    },
})

const handlePayNow = () => {
    emit('payNowClicked')
}
</script>

<template>
    <div
        class="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 px-5 shadow-lg sm:relative sm:mt-6 sm:rounded-xl"
    >
        <div class="flex justify-between items-center max-w-lg mx-auto">
            <div>
                <p class="text-teal-100 text-sm">Total Amount</p>
                <p class="text-white font-bold text-xl">{{ totalAmount }}</p>
            </div>
            <Button
                label="Pay Now"
                size="small"
                class="bg-white! text-teal-600! border-none! px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-teal-50"
                @click="handlePayNow"
            />
        </div>
    </div>
</template>
