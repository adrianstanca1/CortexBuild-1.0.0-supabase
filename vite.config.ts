import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const apiUrl = env.VITE_API_URL || 'http://localhost:3001';

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        hmr: {
          port: 3000,
        },
        // Proxy disabled - app uses Supabase directly
        // proxy: {
        //   '/api': {
        //     target: apiUrl,
        //     changeOrigin: true,
        //   }
        // }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      build: {
        // Production optimizations
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
        sourcemap: false,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules/@monaco-editor')) {
                return 'monaco';
              }
              if (id.includes('components/sdk/') || id.includes('components/screens/developer/')) {
                return 'developer-tools';
              }
              if (id.includes('components/marketplace/')) {
                return 'marketplace';
              }
              if (id.includes('components/screens/modules/')) {
                return 'module-screens';
              }
              if (id.includes('node_modules/jspdf') || id.includes('node_modules/jspdf-autotable')) {
                return 'pdf-tools';
              }
              if (id.includes('node_modules/react-dom') || id.includes('node_modules/react') || id.includes('node_modules/scheduler')) {
                return 'react-core';
              }
              if (id.includes('node_modules/lucide-react')) {
                return 'icon-pack';
              }
              if (id.includes('node_modules/@supabase')) {
                return 'supabase';
              }
              if (id.includes('node_modules/@xyflow')) {
                return 'workflow';
              }
              if (id.includes('node_modules/axios')) {
                return 'axios';
              }
              if (id.includes('node_modules/@google')) {
                return 'google-ai';
              }
              if (id.includes('node_modules')) {
                return 'vendor';
              }
            },
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
          }
        },
        chunkSizeWarningLimit: 1000,
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
