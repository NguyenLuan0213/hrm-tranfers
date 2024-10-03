import { test, expect } from "@playwright/test";

//Test case thống kê báo cáo theo thời gian không xuất hiện khi chưa chọn đủ thông tin
test('Test chart khi chưa có đủ thông tin(theo tháng) loại phòng ban', async ({ page }) => {
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

    const linesAfterData = await page.locator('g.recharts-line').count();
    expect(linesAfterData).toBeLessThan(2); // Kiểm tra số lượng line lớn hơn 0 khi có dữ liệu
});

// Test case thống kê báo cáo theo thời gian không xuất hiện khi chưa chọn đủ thông tin
test('Test chart khi chưa có đủ thông tin(theo năm) loại phòng ban', async ({ page }) => {
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

    const linesAfterData = await page.locator('g.recharts-line').count();
    expect(linesAfterData).toBeLessThan(2); // Kiểm tra số lượng line lớn hơn 0 khi có dữ liệu
});

// Test case thống kê báo cáo theo thời gian không xuất hiện khi chưa chọn đủ thông tin
test('Test chart khi chưa có đủ thông tin(theo quý) loại phòng ban', async ({ page }) => {
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

   const linesAfterData = await page.locator('g.recharts-line').count();
   expect(linesAfterData).toBeLessThan(2); // Kiểm tra số lượng line lớn hơn 0 khi có dữ liệu
}); 