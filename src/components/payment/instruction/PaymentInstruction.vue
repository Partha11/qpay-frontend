<script setup>
import { ref } from 'vue'
defineProps({
    method: {
        type: String,
        default: '',
    },
    amount: {
        type: String,
        default: '0.00',
    },
    number: {
        type: String,
        default: '017xxxxxxxx',
    },
})

const ussdCodes = ref({
    bkash: '*247#',
    rocket: 'Rocket',
    nagad: '*111#',
    AirtelMoney: 'AirtelMoney',
})
</script>

<template>
    <div class="bg-teal-50 rounded-xl p-4 mb-6">
        <h4 class="font-medium text-teal-800 mb-2 flex items-center">
            <span class="mdi mdi-information-outline mr-2"></span>
            How to pay with <span class="ml-1">{{ method }}</span>
        </h4>
        <ol class="list-decimal list-inside text-sm text-gray-700 space-y-1">
            <li>Dial {{ ussdCodes[method.toLowerCase()] ?? '' }} from your mobile</li>
            <li>Select "Send Money" option</li>
            <li>
                Enter merchant number: <span class="font-medium">{{ number }}</span>
            </li>
            <li>
                Enter amount: <span class="font-medium">{{ amount }}</span>
            </li>
            <li>Enter your PIN</li>
            <li>Enter the transaction ID you receive</li>
        </ol>
    </div>
</template>
