<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/header/AppHeader.vue'
import AppToast from '@/components/widgets/toast/AppToast.vue'
import LoadingOverlay from '@/components/widgets/overlay/LoadingOverlay.vue'
</script>

<template>
    <div class="min-h-screen bg-gray-50 flex flex-col items-center p-4">
        <!-- Mobile container with max-width constraint -->
        <div class="w-full max-w-md">
            <AppHeader class="mb-4" />
            <!-- Main content area -->
            <main class="w-full">
                <LoadingOverlay />
                <AppToast />
                <RouterView />
            </main>
        </div>
    </div>
</template>
