import { message } from "antd";
import { checkMassage, login } from "./hepersTransferDecisions"
import { test, expect } from '@playwright/test';

//Test case theo kịch bản đúng 
//Có quyền xem trang danh sách quyết định điều chuyển
test('Chuyển đến trang quản lý quyết định điều chuyển có phân quyền', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, "Ban giám đốc", "Phòng giám đốc");
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();
    const message = await page.locator('.ant-message-custom-content').isVisible();
    expect(message).toBe(false);
});

//Test nhân viên tạo xem chi tiết, quyết định điều chuyển, không xem được lịch sử
test('Test nhân viên xem chi tiết quyết định điều chuyển, không xem được lịch sử', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, "Ban giám đốc", "Phòng giám đốc");
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();

    const userCreate = await page.locator('.ant-table-row[data-row-key="1"] td.ant-table-cell:nth-child(3)').innerText();

    await login(page, "Nhân viên", "Phòng Nhân sự", userCreate);
    await page.locator('table tbody tr button:has-text("Chi tiết")').first().click();

    const message = await page.locator('.ant-message-custom-content').isVisible();
    expect(message).toBe(false);

    const titleLocator = page.locator('.ant-card-head-title:has-text("Lịch sử duyệt đơn điều chuyển")');
    const isTitleVisible = await titleLocator.isVisible();

    if (isTitleVisible) {
        expect(isTitleVisible).toBe(false);
    }
});

//Test quản lý và giám đốc xem chi tiết và lịch sử quyết định điều chuyển
test('Test quản lý xem lịch sử quyết định điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, "Ban giám đốc", "Phòng giám đốc");
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();
    await page.locator('button:has-text("Chi tiết")').first().click();

    const title = await page.locator('.ant-card-head-title:has-text("Lịch sử duyệt đơn điều chuyển")').isVisible();
    expect(title).toBe(true);
});

//Test case theo kịch bản không đúng 
//User không có quyền truy cập trang quản lý quyết định điều chuyển
test('User không có quyền truy cập trang quản lý quyết định điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, "Nhân viên", "Phòng kế toán");
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();
    const message = page.locator('.ant-message-custom-content');
    const messageText = await message.innerText();
    await checkMassage(page, messageText);
    const isMessage = await message.isVisible();
    expect(isMessage).toBe(true);
});

//Test nhân viên khác không thể xem chi tiết quyết định điều chuyển
test('Test nhân viên khác không thể xem chi tiết quyết định điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, "Ban giám đốc", "Phòng giám đốc");
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();
    await login(page, "Nhân viên", "Phòng Nhân sự");
    await page.locator('table tbody tr button:has-text("Chi tiết")').first().click();
    const message = await page.locator('.ant-message-custom-content').isVisible();
    expect(message).toBe(false);
    await checkMassage(page, "Bạn không có quyền xem đơn này");
});


