import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // SIGURADUHIN NA MAY GANITO

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // SIGURADUHIN NA NANDITO ITO
  ],
})