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
      '/api/chat': {
        target: 'https://openrouter.ai/api/v1/chat',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, ''),
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
      'megajs', // Add megajs here
      '@radix-ui/react-tabs',
      '@radix-ui/react-select',
    ],
  },
}));
