import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.resolve();

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@api', replacement: path.resolve(__dirname, 'src/api') },
      { find: '@assets', replacement: path.resolve(__dirname, 'src/assets') },
      { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
      { find: '@layout', replacement: path.resolve(__dirname, 'src/layout') },
      { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
      { find: '@router', replacement: path.resolve(__dirname, 'src/router') },
      { find: '@store', replacement: path.resolve(__dirname, 'src/store') },
      { find: '@styles', replacement: path.resolve(__dirname, 'src/styles') },
      { find: '@hooks', replacement: path.resolve(__dirname, 'src/hooks') },
    ],
  },

  /** 로컬 개발 용도 -> 배포할 때는 nginx */
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      // '/api': {
      //   target: 'http://solvemeup.com',
      //   changeOrigin: true,
      //   secure: false,
      // },
      // "/oauth2": {
      //   target: "http://solvemeup.com",
      //   changeOrigin: true,
      //   secure: false,
      // },
      // "/login": {
      //   target: "http://solvemeup.com",
      //   changeOrigin: true,
      //   secure: false,
      // },
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});
