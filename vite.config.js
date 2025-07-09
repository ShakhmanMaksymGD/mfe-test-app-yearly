import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'
import federation from "@originjs/vite-plugin-federation"
import topLevelAwait from 'vite-plugin-top-level-await'
import vitePluginSingleSpa from 'vite-plugin-single-spa'
import externalize from "vite-plugin-externalize-dependencies"
import fs from 'fs'
import path from 'path'
import versionCleanup from 'mfe-test-scripts/plugins/version-cleanup'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'))
const version = packageJson.version

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    vuetify({ autoImport: true }),
    vitePluginSingleSpa({
      type: 'root',
      serverPort: 4104,
      spaEntryPoints: 'src/main.js',
    }),
    federation({
      name: 'yearly-app',
      filename: `remoteEntry-${version}.js`,
      exposes: {
        './YView': './src/App.vue',
      },
      shared: ['vue', 'pinia', 'vuetify']
    }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    }),
    externalize({
      externals: ['@shared/utility'],
    }),
    versionCleanup(5, __dirname)
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 4104,
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 40960,
    minify: true,
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: false,
    rollupOptions: {
      output: {
        minifyInternalExports: false
      },
      external: ['@shared/utility']
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  }
})
