/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // options go here
    globals: true,
    environment: 'node', // or 'node'
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
