import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  preview: { port: 4173, allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app', '.ngrok.io'] },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep Vite's dynamic-import helper out of the three.js chunks, otherwise the entry statically imports them.
          if (id.includes('vite/preload-helper') || id.includes('vite/modulepreload-polyfill')) return 'react'
          if (id.includes('node_modules/three/')) return 'three'
          if (id.includes('@react-three/fiber')) return 'r3f'
          if (id.includes('@react-three/drei') || id.includes('three-stdlib') || id.includes('troika')) return 'drei'
          if (id.includes('postprocessing')) return 'postfx'
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) return 'motion'
          if (id.includes('react-router')) return 'router'
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler')) return 'react'
        },
      },
    },
  },
})
