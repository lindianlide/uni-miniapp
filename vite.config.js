import path from 'node:path'

import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default ({ command, mode }) => {
  console.log('command', command)
  loadEnv(mode, path.resolve(process.cwd(), 'env'))

  return defineConfig({
    envDir: './env', // 自定义env目录
    plugins: [uni()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url))
      }
    }
  })
}
