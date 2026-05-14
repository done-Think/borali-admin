import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

const alias = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
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
  test: {
    coverage: {
      include: ['src/shared/services/adminMappers.ts'],
      reporter: ['text'],
    },
  },
})
