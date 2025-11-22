import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: (id) => {
        // Don't bundle API files - Vercel handles them separately
        return id.startsWith('./api/') || id.startsWith('../api/');
      },
      output: {
        manualChunks: {
          // Separate React and React Router into their own chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // PDF libraries will be in a separate chunk (loaded dynamically)
          'pdf-vendor': ['jspdf', 'jspdf-autotable'],
        }
      }
    },
    chunkSizeWarningLimit: 600, // Increase limit slightly since we're code-splitting
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})

