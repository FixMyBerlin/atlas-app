import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components/'),
      '@pages': path.resolve(__dirname, './src/pages/'),
      '@routes': path.resolve(__dirname, './src/routes/'),
      '@assets': path.resolve(__dirname, './src/assets/'),
    },
  },
  plugins: [react()],
})
