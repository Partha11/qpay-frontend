<script setup>
import { ref } from 'vue'
import { Button, Card, InputText, InputGroup } from 'primevue'
import InputGroupAddon from 'primevue/inputgroupaddon'
import { Phone } from 'lucide-vue-next'

defineProps({
    method: {
        type: String,
        required: true,
    },
    isSubmitting: {
        type: Boolean,
        required: true,
    },
})

const emit = defineEmits(['submit'])

const phoneNumber = ref('')
const transactionId = ref('')

function handleSubmit() {
    emit('submit', {
        phone_number: phoneNumber.value,
        trx_id: transactionId.value,
    })
}
</script>

<template>
    <Card class="mb-4">
        <template #header>
            <div class="ms-4 mt-4">
                <span class="text-lg font-semibold">Payment Details</span>
            </div>
        </template>
        <template #content>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label for="phoneNumber" class="block text-sm font-medium text-700 mb-2">Phone Number</label>
                    <InputGroup>
                        <InputGroupAddon>
                            <Phone size="16"/>
                        </InputGroupAddon>
                        <InputText id="phoneNumber" v-model="phoneNumber" type="tel" placeholder="01xxxxxxxx"
                            class="w-full text-md!" required />
                    </InputGroup>
                </div>
                <div>
                    <label for="transactionId" class="block text-sm font-medium text-700 mb-2">Transaction ID</label>
                    <InputGroup>
                        <InputGroupAddon>
                            <!-- <span>
                                <svg-icon type="mdi" :path="mdiCardAccountDetailsOutline" size="18"></svg-icon>
                            </span> -->
                            <Phone size="18"/>
                        </InputGroupAddon>
                        <InputText id="transactionId" v-model="transactionId" placeholder="Ex: 8A4D2E..."
                            class="w-full text-md!" required />
                    </InputGroup>
                </div>
                <Button type="submit" label="Complete Payment" class="w-full text-md! bg-teal-600! border-none!"
                    severity="success" :disabled="isSubmitting" :loading="isSubmitting" />
            </form>
        </template>
    </Card>
</template>
