import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { Toast, Ripple, Tooltip } from 'primevue'
import ToastService from 'primevue/toastservice'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ToastService)

app.use(PrimeVue, {
    ripple: true,
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.my-app-dark',
        },
    },
})
app.directive('toast', Toast)
app.directive('ripple', Ripple);
app.directive('tooltip', Tooltip);

app.mount('#app')
