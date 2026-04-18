import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const alias = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': alias('./src'),
      '@shared': alias('./src/shared'),
      '@modules': alias('./src/modules'),
      '@layouts': alias('./src/layouts'),
      '@theme': alias('./src/theme'),
      '@routes': alias('./src/routes'),
    },
  },
})
