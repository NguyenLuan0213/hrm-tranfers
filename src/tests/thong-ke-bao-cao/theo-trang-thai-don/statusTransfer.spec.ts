import { test, expect } from '@playwright/test';

//test kiểm tra chart trạng thái đơn yêu cầu điều chuyển
test('Kiểm tra trạng thái đơn yêu cầu điều chuyển', async ({ page }) => {
    // Di chuyển đến trang đăng nhập
    await page.goto('http://localhost:3000/statistics/status');

    //chọn loại đơn
    await page.locator('.ant-select-selection-item').click();
    await page.locator('.ant-select-item-option-content').nth(0).click();

    //kiểm tra kết quả
    const result = await page.locator('.recharts-layer .recharts-bar-rectangle').count();
    expect(result).toEqual(6);
});

//test kiểm tra chart trạng thái đơn quyết định điều chuyển
test('Kiểm tra trạng thái đơn quyết định điều chuyển', async ({ page }) => {
    // Di chuyển đến trang đăng nhập
    await page.goto('http://localhost:3000/statistics/status');

    //chọn loại đơn
    await page.locator('.ant-select-selection-item').click();
    await page.locator('.ant-select-item-option-content').nth(1).click();

    //kiểm tra kết quả
    const result = await page.locator('.recharts-layer .recharts-bar-rectangle').count();
    expect(result).toEqual(6);
});