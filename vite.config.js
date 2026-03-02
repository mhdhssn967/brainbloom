import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,webp}']
      },
      manifest: {
        name: 'BrainBloom',
        short_name: 'BrainBloom',
        description: 'Gamified classroom learning for smart boards',
        theme_color: '#FF5733',
        background_color: '#06020f',
        display: 'fullscreen',
        orientation: 'landscape',
        icons: [
          { src: '/pwa-icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})