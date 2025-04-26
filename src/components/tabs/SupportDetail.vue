<script setup>
import { Phone, Mail, MapPin } from 'lucide-vue-next'

defineProps({
    brand: {
        type: Object,
        default: null,
    },
})
</script>

<template>
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-gray-100 py-3 px-6">
            <h3 class="text-gray-700 font-semibold text-center">Customer Support</h3>
        </div>
        <div class="p-6">
            <div class="mb-6">
                <h4 class="text-gray-800 font-medium mb-2">Have questions about your payment?</h4>
                <p class="text-gray-600 text-sm">
                    Our support team is here to help you with any issues or questions you may have.
                </p>
            </div>
            <div class="space-y-4">
                <div class="flex items-center gap-3">
                    <span class="text-teal-700 bg-teal-100 rounded-full p-2">
                        <Phone size="16" />
                    </span>
                    <div class="flex flex-col">
                        <span class="text-md">Call Us</span>
                        <span class="text-xs text-gray-500">{{
                            brand?.phone_number ?? 'N/A'
                        }}</span>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-teal-700 bg-teal-100 rounded-full p-2">
                        <Mail size="16" />
                    </span>
                    <div class="flex flex-col">
                        <span class="text-md">Email Us</span>
                        <span class="text-xs text-gray-500">{{ brand?.email ?? 'N/A' }}</span>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-teal-700 bg-teal-100 rounded-full p-2">
                        <MapPin size="16" />
                    </span>
                    <div class="flex flex-col">
                        <span class="text-md">Address</span>
                        <span class="text-xs text-gray-500">{{ brand?.address ?? 'N/A' }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
