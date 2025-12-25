import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './smart-parking', // Ithu unga files-ah relative path-la load panna help pannum
})
