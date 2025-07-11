<script setup>
import { ref } from 'vue'
import { Avatar, Button } from 'primevue'
import { getIcon } from '@/utils/icon.js'

defineProps({
    brand: {
        type: Object,
        default: null,
    },
})

const emit = defineEmits(['tabChange'])

const activeTab = ref('payment')
const defaultLogoUrl = ref(
    'https://img.freepik.com/premium-vector/logo-online-store-business-company-brand_737924-1394.jpg?semt=ais_hybrid&w=740',
)
const tabs = ref([
    { key: 'payment', label: 'Payment', icon: 'CreditCard' },
    { key: 'details', label: 'Details', icon: 'Info' },
    { key: 'support', label: 'Support', icon: 'Headset' },
])

const selectTab = (tabKey) => {
    activeTab.value = tabKey
    emit('tabChange', tabKey)
}
</script>

<template>
    <div class="bg-white rounded-xl shadow-md p-4 mb-6">
        <div class="flex flex-col sm:flex-row items-center">
            <div class="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                <Avatar :image="brand?.images?.find(() => true)?.thumbnail_url || defaultLogoUrl" size="xlarge"
                    shape="circle" class="w-24 h-24 ring-2 ring-teal-50 shadow-md" />
            </div>
            <div class="text-center sm:text-left">
                <span class="text-xl font-bold text-gray-800 mb-2">
                    {{ brand?.name || 'Brand' }}
                </span>
                <div class="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                    <Button v-for="tab in tabs" :key="tab.key" size="small"
                        class="font-medium transition-colors rounded-lg border-none!" :class="activeTab === tab.key
                            ? 'bg-teal-100! text-teal-800!'
                            : 'bg-gray-100! text-gray-600! hover:bg-teal-100! hover:text-teal-800!'
                            " @click="selectTab(tab.key)">
                        <span :class="activeTab === tab.key
                            ? 'text-teal-800'
                            : 'text-gray-600 hover:text-teal-800!'
                            ">
                            <component :is="getIcon(tab.icon)" class="w-4 h-4" />
                        </span>
                        <span class="text-md font-medium">{{ tab.label }}</span>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
