import { createRouter, createWebHistory } from 'vue-router'
import VerifyView from '@/views/VerifyView.vue'
import CheckoutView from '@/views/CheckoutView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/checkout/:id',
            name: 'checkout',
            component: CheckoutView,
            meta: {
                isPaymentView: true
            }
        },
        {
            path: '/verify/:id',
            name: 'verify',
            component: VerifyView,
            meta: {
                isPaymentView: true
            }
        },
    ],
})

export default router
