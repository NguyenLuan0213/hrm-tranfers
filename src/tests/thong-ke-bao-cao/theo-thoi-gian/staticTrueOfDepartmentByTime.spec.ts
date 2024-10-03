import { test, expect } from "@playwright/test";

// Test case thống kê báo cáo theo thời gian có xuất hiện
test('Test chart có hiện khi chọn đủ thông tin(theo tháng) loại phòng ban', async ({ page }) => {
    await page.goto('http://localhost:3000/statistics');

    // Click select chọn loại thống kê báo cáo
    await page.locator('.ant-select-selection-item').click();
    await page.locator('.ant-select-item-option-content').nth(1).click();

    // Click chọn select chọn phòng ban
    await page.locator('.ant-select-selection-search-input').nth(2).click();
    await page.locator('.ant-select-item-option-content').nth(4).click();

    // Click select chọn loại thời gian
    await page.locator('.ant-select-selection-search-input').nth(3).click();
    await page.locator('.ant-select-item-option-content').nth(12).click();

    // Click select chọn thời gian
    await page.locator('.ant-picker-range').click();

    // Chọn tháng bắt đầu là 2021-10
    await page.getByTitle('2024-10').click();

    // Chọn tháng kết thúc là 2021-11
    await page.getByTitle('2024-11').click();

    const linesAfterData = await page.locator('g.recharts-line').count();
    expect(linesAfterData).toBeGreaterThan(0); // Kiểm tra số lượng line lớn hơn 0 khi có dữ liệu
});

// Test case thống kê báo cáo theo thời gian có xuất hiện
test('Test chart có hiện khi chọn đủ thông tin(theo năm) loại phòng ban', async ({ page }) => {
    await page.goto('http://localhost:3000/statistics');

    // Click select chọn loại thống kê báo cáo
    await page.locator('.ant-select-selection-item').click();
    await page.locator('.ant-select-item-option-content').nth(1).click();

    // Click chọn select phòng ban
    await page.locator('.ant-select-selection-search-input').nth(2).click();
    await page.locator('.ant-select-item-option-content').nth(5).click();

    // Click select chọn loại thời gian
    await page.locator('.ant-select-selection-search-input').nth(3).click();
    await page.locator('.ant-select-item-option-content').nth(14).click();

    // Click select chọn thời gian
    await page.locator('.ant-picker-range').click();

    // Chọn năm bắt đầu là 2021
    await page.getByTitle('2024').click();

    // Chọn năm kết thúc là 2022
    await page.getByTitle('2025').click();

    const linesAfterData = await page.locator('g.recharts-line').count();
    expect(linesAfterData).toBeGreaterThan(0); // Kiểm tra số lượng line lớn hơn 0 khi có dữ liệu
});

// Test case thống kê báo cáo theo thời gian có xuất hiện
test('Test chart có hiện khi chọn đủ thông tin(theo quý) loại phòng ban', async ({ page }) => {
    await page.goto('http://localhost:3000/statistics');

     // Click select chọn loại thống kê báo cáo
     await page.locator('.ant-select-selection-item').click();
     await page.locator('.ant-select-item-option-content').nth(1).click();
 
     // Click chọn select phòng ban
     await page.locator('.ant-select-selection-search-input').nth(2).click();
     await page.locator('.ant-select-item-option-content').nth(4).click();
 
     // Click select chọn loại thời gian
     await page.locator('.ant-select-selection-search-input').nth(3).click();
     await page.locator('.ant-select-item-option-content').nth(13).click();

    // Click select chọn thời gian
    await page.locator('.ant-picker-range').click();

    // Chọn quý bắt đầu là 2021-10
    await page.getByTitle('2024-Q1').click();

    // Chọn quý kết thúc là 2021-11
    await page.getByTitle('2024-Q3').click();

    const linesAfterData = await page.locator('g.recharts-line').count();
    expect(linesAfterData).toBeGreaterThan(0); // Kiểm tra số lượng line lớn hơn 0 khi có dữ liệu
});
