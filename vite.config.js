import { fileURLToPath, URL } from 'node:url'
import { dirname } from 'node:path'
import dns from 'node:dns';

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

dns.setDefaultResultOrder('verbatim');

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const __dirname = dirname(fileURLToPath(import.meta.url));

    const env = loadEnv(mode, __dirname, '');
    const apiUrl = env.VITE_API_BASE_URL || 'http://127.0.0.1:3000';

    return {
        plugins: [
            vue(),
            vueDevTools(),
            tailwindcss(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            },
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        'lucide-vue': ['lucide-vue-next']
                    }
                }
            }
        },
        server: {
            proxy: {
                '/api': {
                    target: apiUrl,
                    changeOrigin: true,
                    secure: false,
                }
            }
        }
    }
})
