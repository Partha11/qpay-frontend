<script setup>
import { useRouter } from 'vue-router'
import { ArrowLeft, Languages, X } from 'lucide-vue-next'

const router = useRouter()

const toggleLanguage = () => {
    console.log('Language toggle clicked')
}

const goBack = () => {
    if (window.history.state?.back) {
        router.go(-1)
    }
}

const confirmClose = () => {
    if (window.android) {
        window.android.closeWindow()
    } else {
        window.history.back()
    }
}
</script>

<template>
    <div class="bg-white rounded-xl shadow-md flex items-center relative p-4 mb-6">
        <!-- Back button with fixed width -->
        <div class="flex-shrink-0">
            <span class="text-gray-700 hover:text-green-500 cursor-pointer" @click="goBack">
                <ArrowLeft size="20" @click="goBack" />
            </span>
        </div>

        <!-- Absolutely positioned centered title -->
        <h1 class="text-lg font-semibold text-gray-700 absolute left-1/2 transform -translate-x-1/2">
            Checkout
        </h1>

        <!-- Button group with fixed width -->
        <div class="w-24 flex-shrink-0 flex justify-end gap-4 ml-auto">
            <span class="text-gray-700 cursor-pointer hover:text-amber-500" @click="toggleLanguage">
                <Languages size="20" />
            </span>
            <span class="text-gray-700 cursor-pointer hover:text-red-500" @click="confirmClose">
                <X size="20" />
            </span>
        </div>
    </div>
</template>
