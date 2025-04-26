<script setup>
import { storeToRefs } from 'pinia'
import { useLoadingStore } from '@/stores/loading'

const loadingStore = useLoadingStore()
const { visible, message, subMessage } = storeToRefs(loadingStore)
</script>

<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50 transition-opacity duration-300"
        :class="{ 'opacity-0 pointer-events-none': !visible }"
    >
        <div class="flex flex-col items-center">
            <div
                class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"
            ></div>
            <h2 class="text-center text-gray-700 text-xl font-semibold">{{ message }}</h2>
            <p class="w-full text-center text-gray-500">{{ subMessage }}</p>
        </div>
    </div>
</template>

<style scoped>
.loader {
    border-top-color: #3b82f6;
    -webkit-animation: spinner 1.5s linear infinite;
    animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
    0% {
        -webkit-transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
    }
}

@keyframes spinner {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
