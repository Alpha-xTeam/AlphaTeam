import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
 
  define: {
    global: {},
    'process.env': {},
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/mega-api': {
        target: 'https://g.api.mega.co.nz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mega-api/, ''),
      },
      '/deepseek-api': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/deepseek-api/, ''),
      },
      '/puter-api': {
        target: 'https://js.puter.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/puter-api/, ''),
      },
    },
  },
  base: mode === 'development' ? '/' : '/AlphaTeam/', // تعديل المسار بناءً على الوضع
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // لمنع تقسيم الملفات
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      'firebase/app',
      'megajs',
      '@radix-ui/react-tabs',
      '@radix-ui/react-select',
    ],
  },
}));
