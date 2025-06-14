import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  proxy: {
    '/api': {
      target: 'https://skilltrackerapp-u627.onrender.com',
      changeOrigin: true,
      secure: true,
    }},
})
