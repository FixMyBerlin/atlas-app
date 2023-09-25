import { loadEnvConfig } from "@next/env"
import react from "@vitejs/plugin-react"
import path from 'path'
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

const projectDir = process.cwd()
loadEnvConfig(projectDir)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components/'),
      '@pages': path.resolve(__dirname, './src/pages/'),
      '@routes': path.resolve(__dirname, './src/routes/'),
      '@assets': path.resolve(__dirname, './src/assets/'),
      '@fakeServer': path.resolve(__dirname, './src/fakeServer/'),
      '@api': path.resolve(__dirname, './src/api/'),
    },
  },
  test: {
    // https://vitest.dev/config/#globals
    dir: "./",
    globals: true,
    setupFiles: "./test/setup.ts",
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
})
