import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // ✅ default but good to make explicit
  },
  base: '/', // ✅ ensures assets resolve correctly on Vercel
})
