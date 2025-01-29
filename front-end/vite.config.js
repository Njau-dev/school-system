import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// Fix __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets')
    }
  },
  build: {
    assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg']
  }
})
