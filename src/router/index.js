import { createRouter, createWebHistory } from 'vue-router'
import VerifyView from '@/views/VerifyView.vue'
import CheckoutView from '@/views/CheckoutView.vue'

const router = createRouter({
    history: createWebHistory('/qpay/'),
    routes: [
        {
            path: '/checkout/:id',
            name: 'checkout',
            component: CheckoutView
        },
        {
            path: '/verify/:id',
            name: 'verify',
            component: VerifyView
        },
    ],
})

export default router
