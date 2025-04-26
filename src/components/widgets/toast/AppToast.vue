<script setup>
import { Button, Toast } from 'primevue'
import { getIcon } from '@/utils/icon'

const icon = async (severity) => {
    switch (severity) {
        case 'success':
            return getIcon('AlarmClock')
        case 'info':
            return getIcon('AlarmClock')
        case 'warn':
            return getIcon('AlarmClock')
        case 'danger':
            return getIcon('AlarmClock')
        default:
            return getIcon('AlarmClock')
    }
}

const color = (severity) => {
    switch (severity) {
        case 'success':
            return 'text-green-600'
        case 'info':
            return 'text-blue-600'
        case 'warn':
            return 'text-amber-600'
        case 'danger':
            return 'text-red-600'
        default:
            return 'text-green-600'
    }
}

const bg = (severity) => {
    switch (severity) {
        case 'success':
            return 'bg-green-100'
        case 'info':
            return 'bg-blue-100'
        case 'warn':
            return 'bg-amber-100'
        case 'danger':
            return 'bg-red-100'
        default:
            return 'bg-green-100'
    }
}
</script>

<template>
    <Toast position="top-center">
        <template #container="{ message, closeCallback }">
            <section class="flex flex-col pt-1 pb-3 px-3 w-full rounded-xl" :class="bg(message.severity)">
                <div class="flex items-center justify-between">
                    <div class="flex flex-row items-center space-x-1.5">
                        <component :is="icon(message.severity)" class="w-3 h-3" />
                        <span class="font-medium text-md" :class="color(message.severity)">{{
                            message.summary
                            }}</span>
                    </div>
                    <Button icon="pi pi-times" :severity="message.severity" variant="text" size="small" rounded
                        aria-label="Cancel" @click="closeCallback" />
                </div>
                <div>
                    <span class="text-sm text-gray-800">{{ message.detail }}</span>
                </div>
            </section>
        </template>
    </Toast>
</template>
