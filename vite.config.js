import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/chatwrapp-analysis/', // GITHUB_REPO_ADINIZI_BURAYA_YAZIN (Örn: '/chat-tahlil/')
})
