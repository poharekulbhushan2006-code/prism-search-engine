import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wgslPlugin = {
  name: 'wgsl-loader',
  transform(code, id) {
    if (id.endsWith('.wgsl')) {
      return {
        code: `export default ${JSON.stringify(code)};`,
        map: null
      };
    }
  }
};

export default defineConfig({
  plugins: [react(), wgslPlugin],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});

