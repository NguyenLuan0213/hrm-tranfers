import { test, expect } from "@playwright/test";

// Test case thống kê báo cáo theo thời gian không xuất hiện khi chưa chọn đủ thông tin
test('Test chart khi chưa có đủ thông tin(theo ngày) loại số lượng đơn', async ({ page }) => {
    await page.goto('http://localhost:3000/statistics');

    // Click button chọn loại thống kê báo cáo
    await page.locator('.ant-select-selection-item').click();
    await page.locator('.ant-select-item-option-content').nth(3).click();

    // Click button chọn thời gian
    await page.locator('.ant-select-selection-search-input').nth(2).click();
    await page.locator('.ant-select-item-option-content').nth(4).click();

    const linesAfterData = await page.locator('g.recharts-line').count();
    expect(linesAfterData).toBeLessThan(1); // Kiểm tra số lượng line lớn hơn 0 khi có dữ liệu
});

//Test case thống kê báo cáo theo thời gian không xuất hiện khi chưa chọn đủ thông tin
test('Test chart khi chưa có đủ thông tin(theo tháng) loại số lượng đơn', async ({ page }) => {
    await page.goto('http://localhost:3000/statistics');

    // Click button chọn loại thống kê báo cáo
    await page.locator('.ant-select-selection-item').click();
    await page.locator('.ant-select-item-option-content').nth(3).click();

    // Click button chọn thời gian
    await page.locator('.ant-select-selection-search-input').nth(2).click();
    await page.locator('.ant-select-item-option-content').nth(5).click();

    const linesAfterData = await page.locator('g.recharts-line').count();
    expect(linesAfterData).toBeLessThan(1); // Kiểm tra số lượng line lớn hơn 0 khi có dữ liệu
});

// Test case thống kê báo cáo theo thời gian không xuất hiện khi chưa chọn đủ thông tin
test('Test chart khi chưa có đủ thông tin(theo năm) loại số lượng đơn', async ({ page }) => {
    await page.goto('http://localhost:3000/statistics');

    // Click button chọn loại thống kê báo cáo
    await page.locator('.ant-select-selection-item').click();
    await page.locator('.ant-select-item-option-content').nth(3).click();

    // Click button chọn thời gian
    await page.locator('.ant-select-selection-search-input').nth(2).click();
    await page.locator('.ant-select-item-option-content').nth(7).click();

    const linesAfterData = await page.locator('g.recharts-line').count();
    expect(linesAfterData).toBeLessThan(1); // Kiểm tra số lượng line lớn hơn 0 khi có dữ liệu
});

// Test case thống kê báo cáo theo thời gian không xuất hiện khi chưa chọn đủ thông tin
test('Test chart khi chưa có đủ thông tin(theo quý) loại số lượng đơn', async ({ page }) => {
    await page.goto('http://localhost:3000/statistics');

    // Click button chọn loại thống kê báo cáo
    await page.locator('.ant-select-selection-item').click();
    await page.locator('.ant-select-item-option-content').nth(3).click();

    // Click button chọn thời gian
    await page.locator('.ant-select-selection-search-input').nth(2).click();
    await page.locator('.ant-select-item-option-content').nth(6).click();

    const linesAfterData = await page.locator('g.recharts-line').count();
    expect(linesAfterData).toBeLessThan(1); // Kiểm tra số lượng line lớn hơn 0 khi có dữ liệu
});