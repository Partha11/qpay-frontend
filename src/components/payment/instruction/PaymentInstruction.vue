<script setup>
import { computed } from 'vue'
import { BookOpen } from 'lucide-vue-next'

const props = defineProps({
    method: {
        type: Object,
        default: () => ({
            name: '',
            ussd_code: '',
            phone_number: '',
            type: '',
        }),
    },
    amount: {
        type: String,
        default: '0.00',
    },
})

const formattedType = computed(() => {
    if (!props.method?.type) return 'Send Money'
    return props.method.type
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/^\w/, (c) => c.toUpperCase())
})
</script>

<template>
    <div class="bg-teal-50 rounded-xl p-4 mb-6">
        <div class="mb-2 flex items-center gap-2">
            <BookOpen size="14" class="text-teal-800" />
            <span class="text-md font-medium text-teal-800 ">Payment Process</span>
        </div>
        <ol class="list-decimal list-inside text-sm text-gray-700 space-y-1">
            <li>Dial <span class="font-medium">{{ method?.ussd_code ?? '' }}</span> from your mobile</li>
            <li>Select the <span class="font-medium">{{ formattedType }}</span> option</li>
            <li>Enter merchant number: <span class="font-medium">{{ method?.phone_number ?? '' }}</span></li>
            <li>Enter amount: <span class="font-medium">{{ amount }}</span></li>
            <li>Enter your PIN</li>
            <li>Enter the transaction ID you received</li>
            <li>Enter the phone number you paid with</li>
        </ol>
    </div>
</template>
