import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { nodePolyfills } from "@bangjelkoski/vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
      globals: {
        Buffer: true,
        global: true,
        process: true
      }
    })
  ],
  build: {
    target: 'es2020',
  },
  optimizeDeps: {
    exclude: [],
    include: [
      '@noble/hashes',
      '@noble/curves',
      'cross-fetch',
      '@turnkey/viem',
      '@turnkey/http',
      'buffer'
    ],
    esbuildOptions: {
      target: 'es2020',
      define: {
        global: 'globalThis'
      }
    }
  },
  define: {
    'global': 'globalThis',
    'process.env': {}
  }
});