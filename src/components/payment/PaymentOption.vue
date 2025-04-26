<script setup>
const emit = defineEmits(['selected'])

defineProps({
    options: {
        type: Array,
        required: true,
    },
})

const selectPaymentOption = (paymentMethod) => {
    emit('selected', paymentMethod)
}
</script>

<template>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div
            v-for="option in options"
            :key="option.name"
            class="payment-option bg-white rounded-xl shadow-sm border border-gray-100 p-3 cursor-pointer transition-all duration-300 hover:shadow-md"
            @click="selectPaymentOption(option.name)"
        >
            <img :src="option.image" :alt="option.name" class="w-full h-16 p-2 object-contain" />
        </div>
    </div>
</template>
