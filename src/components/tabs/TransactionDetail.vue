<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps({
    amount: {
        type: String,
        default: '0.00',
    },
    metadata: {
        type: Object,
        default: null,
    },
})

const detailItems = computed(() => [
    { label: 'Order ID', value: `#${props.metadata?.invoice_id ?? 'N/A'}` },
    { label: 'Invoice To', value: props.metadata?.customer ?? 'N/A', divider: true },
    { label: 'Product', value: props.metadata?.product ?? 'Product' },
    { label: 'Quantity', value: props.metadata?.quantity ?? '1' },
    {
        label: 'Unit Price',
        value: formatCurrency(props.metadata?.unit_price ?? 0, props.metadata?.currency ?? 'BDT'),
    },
    {
        label: 'Total Amount',
        value: formatCurrency(props.amount ?? 0, props.metadata?.currency ?? 'BDT'),
        highlight: true,
    },
])
</script>

<template>
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-gray-100 py-3 px-6">
            <h3 class="text-gray-700 font-semibold text-center">Transaction Details</h3>
        </div>
        <div class="p-6 scrollable-tab-content">
            <div class="space-y-4">
                <div
                    v-for="item in detailItems"
                    :key="item.label"
                    :class="[
                        'flex justify-between items-center',
                        item.divider ? 'pb-3 border-b border-gray-100' : '',
                        item.highlight ? 'pt-3 border-t border-gray-200' : '',
                    ]"
                >
                    <span
                        :class="['text-gray-600', item.highlight ? 'font-bold text-gray-800' : '']"
                    >
                        {{ `${item.label}:` }}
                    </span>
                    <span :class="[item.highlight ? 'text-teal-600 font-bold' : 'text-gray-800']">
                        {{ item.value }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
