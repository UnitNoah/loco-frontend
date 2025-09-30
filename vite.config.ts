import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,      // ← 원하는 포트 번호
    host: true,      // 네트워크 접근 허용 (예: 모바일 기기에서 같은 WiFi로 접근 가능)
  },
})
