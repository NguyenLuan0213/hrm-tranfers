import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    viewport: { width: 1520, height: 780 }, //
    browserName: 'chromium',
    headless: false,
    baseURL: 'http://localhost:3000',
  },
  testDir: './tests', // Thư mục chứa các file test
});