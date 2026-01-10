<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Button } from 'primevue'
import PaymentOption from './PaymentOption.vue'

const props = defineProps({
    paymentData: {
        type: Object,
        default: () => ({}),
    },
})

const activeTab = ref('')

// Group methods by category and generate tabs dynamically
const tabs = computed(() => {
    if (!props.paymentData?.brand?.methods) return []

    const categoryMap = new Map()

    props.paymentData.brand.methods.forEach((method) => {
        const categorySlug = method.category.slug
        const categoryName = method.category.name

        if (!categoryMap.has(categorySlug)) {
            categoryMap.set(categorySlug, {
                value: categorySlug,
                label: categoryName,
            })
        }
    })

    return Array.from(categoryMap.values())
})

// Group payment options by category
const paymentOptionsByCategory = computed(() => {
    if (!props.paymentData?.brand?.methods) return {}

    const grouped = {}

    props.paymentData.brand.methods.forEach((method) => {
        const categorySlug = method.category.slug

        if (!grouped[categorySlug]) {
            grouped[categorySlug] = []
        }

        grouped[categorySlug].push({
            name: method.name,
            image: method.icon_url,
            ussd_code: method.ussd_code,
            type: method.type,
        })
    })

    return grouped
})

// Get options for the active tab
const activeOptions = computed(() => {
    return paymentOptionsByCategory.value[activeTab.value] || []
})

// Set the first tab as active when tabs change
watch(
    tabs,
    (newTabs) => {
        if (newTabs.length > 0 && !activeTab.value) {
            activeTab.value = newTabs[0].value
        }
    },
    { immediate: true }
)

const emit = defineEmits(['paymentOptionSelected'])

const handlePaymentSelection = (paymentMethod) => {
    emit('paymentOptionSelected', paymentMethod)
}
</script>

<template>
    <div class="mb-6">
        <!-- Payment Method Toggle using PrimeVue Buttons -->
        <div v-if="tabs.length > 0" class="flex gap-1 p-1 rounded-lg">
            <Button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value" :label="tab.label"
                class="flex-1 border-none!" :class="activeTab === tab.value
                    ? 'bg-teal-700! text-white'
                    : 'bg-gray-200! text-gray-700!'
                    " :text="activeTab !== tab.value" :severity="activeTab === tab.value ? undefined : 'secondary'" />
        </div>

        <!-- Tab Content -->
        <div v-if="activeOptions.length > 0" class="mt-4">
            <PaymentOption :options="activeOptions" @selected="handlePaymentSelection" />
        </div>
    </div>
</template>
