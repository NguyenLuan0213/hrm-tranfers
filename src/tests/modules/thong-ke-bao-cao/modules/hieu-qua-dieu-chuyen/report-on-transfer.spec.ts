import { test, expect } from '@playwright/test';

//test theo đơn yêu cầu điều chuyển
test('Test theo đơn yêu cầu điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000/statistics/report')

    await page.locator('.ant-select-selection-item').click();
    await page.locator('.ant-select-item-option-content').nth(0).click();

    // Đợi cho đến khi các phần tử biểu đồ xuất hiện
    await page.waitForSelector('g.recharts-layer g.recharts-pie-sector', { state: 'visible' });
    const result = await page.locator('g.recharts-layer g.recharts-pie-sector').count();
    expect(result).toEqual(3);
});

//test theo đơn quyết định điều chuyển
test('Test theo dơn quyết định điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000/statistics/report')

    await page.locator('.ant-select-selection-item').click();
    await page.locator('.ant-select-item-option-content').nth(1).click();

    await page.waitForSelector('g.recharts-layer g.recharts-pie-sector', { state: 'visible' });
    const result = await page.locator('g.recharts-layer g.recharts-pie-sector').count();
    expect(result).toEqual(3);

});

//test chung 2 đơn yêu cầu và quyết định điều chuyển   
test('Test chung 2 đơn yêu cầu và quyết định điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000/statistics/report')

    await page.goto('http://localhost:3000/statistics/report')

    await page.locator('.ant-select-selection-item').click();
    await page.locator('.ant-select-item-option-content').nth(2).click();

    await page.waitForSelector('g.recharts-layer g.recharts-pie-sector', { state: 'visible' });
    const result = await page.locator('g.recharts-layer g.recharts-pie-sector').count();
    expect(result).toEqual(3);
});