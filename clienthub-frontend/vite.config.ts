/**
 * Vite Configuration
 * ------------------
 * Vite — современный сборщик для фронтенда с мгновенным HMR.
 *
 * Основные преимущества:
 * - Быстрый dev-сервер (ESM native)
 * - Оптимизированная production сборка (Rollup)
 * - Встроенная поддержка TypeScript, JSX, CSS
 *
 * @see https://vite.dev/config/
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  /**
   * Plugins — Расширения функциональности Vite
   * ------------------------------------------
   */
  plugins: [
    /**
     * React Plugin — поддержка React с Fast Refresh (HMR)
     * Использует Oxc для быстрой трансформации JSX
     */
    react(),
  ],

  /**
   * Resolve — Настройки разрешения модулей
   * --------------------------------------
   */
  resolve: {
    /**
     * Алиасы путей — сокращения для импортов
     *
     * Позволяет писать:
     *   import { Button } from '@/components/Button'
     * Вместо:
     *   import { Button } from '../../../components/Button'
     *
     * ВАЖНО: Должно совпадать с paths в tsconfig.app.json
     */
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  /**
   * Server — Настройки dev-сервера
   * ------------------------------
   */
  server: {
    /** Порт dev-сервера (по умолчанию 5173) */
    port: 3000,

    /** Автоматически открывать браузер при запуске */
    open: true,

    /**
     * Прокси API-запросов на бэкенд
     * Решает проблемы CORS в development
     */
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  /**
   * Build — Настройки production сборки
   * -----------------------------------
   */
  build: {
    /** Папка для сборки */
    outDir: 'dist',

    /** Генерировать source maps для отладки в production */
    sourcemap: true,

    /**
     * Rollup-специфичные настройки
     */
    rollupOptions: {
      output: {
        /**
         * Разделение бандла на чанки (code splitting)
         * Улучшает кэширование — вендоры меняются реже
         */
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router-dom')) {
              return 'router';
            }
          }
        },
      },
    },
  },
});
