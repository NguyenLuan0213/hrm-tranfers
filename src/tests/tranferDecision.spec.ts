import { login, waitForMinutes, viewTransferDecisionDetail, checkMassage } from "./hepersTransferDecisions"
import { test } from '@playwright/test';

//Test case
test('chuyển đến trang quản lý quyết định điều chuyển có phân quyền', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, 'Leah Zulauf');
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();
});

//Test case
test('User không có quyền truy cập trang quản lý quyết định điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, 'Taylor Swift');
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();
    const message = await page.locator('div.ant-message-custom-content.ant-message-error').innerText();
    if (message !== 'Bạn không có quyền truy cập vào trang này') {
        throw new Error('Test case failed');
    }
});

//Test case
test('Nhân viên nhân sự tạo đơn yêu cầu điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, 'Chris Hemsworth');
    //chuyển đến trang quản lý quyết định điều chuyển
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();

    await page.getByRole('button', { name: 'Tạo đơn quyết định' }).click();

    await page.locator('.ant-modal-content .ant-select-selector').click();

    //chọn đơn yêu cầu điều chuyển
    const selectTransfer = page.locator(`.ant-select-item-option-content:has-text('ID:24 - Chris Tom')`);
    while (await selectTransfer.isHidden()) {
        await page.keyboard.press('ArrowDown');
    }
    await selectTransfer.click();

    await page.getByRole('button', { name: 'Đồng ý' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    // await waitForMinutes(page);

    await viewTransferDecisionDetail(page, 6);

    //check thông báo
    await checkMassage(page, 'Thêm quyết định điều chuyển mới thành công');

});

//Test case
test('Nhân viên nhân sự tạo đơn yêu cầu điều chuyển không thành công', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, 'Chris Hemsworth');
    //chuyển đến trang quản lý quyết định điều chuyển
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();

    await page.getByRole('button', { name: 'Tạo đơn quyết định' }).click();

    await page.locator('.ant-modal-content .ant-select-selector').click();

    //chọn đơn yêu cầu điều chuyển
    const selectTransfer = page.locator(`.ant-select-item-option-content:has-text('ID:1 - Philip Grady')`);
    while (await selectTransfer.isHidden()) {
        await page.keyboard.press('ArrowDown');
    }
    await selectTransfer.click();

    await page.getByRole('button', { name: 'Đồng ý' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    const message = await page.locator('div.ant-message-custom-content.ant-message-error').innerText();
    if (message !== 'Error: Đã tồn tại quyết định điều chuyển cho yêu cầu này') {
        throw new Error('Test case failed');
    }
});

//Test case
test('Gửi đơn quyết định điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, 'Chris Hemsworth');
    //chuyển đến trang quản lý quyết định điều chuyển
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();

    await page.getByRole('button', { name: 'Tạo đơn quyết định' }).click();

    await page.locator('.ant-modal-content .ant-select-selector').click();

    //chọn đơn yêu cầu điều chuyển
    const selectTransfer = page.locator(`.ant-select-item-option-content:has-text('ID:24 - Chris Tom')`);
    while (await selectTransfer.isHidden()) {
        await page.keyboard.press('ArrowDown');
    }
    await selectTransfer.click();

    await page.getByRole('button', { name: 'Đồng ý' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    //check thông báo
    await checkMassage(page, 'Thêm quyết định điều chuyển mới thành công');

    await viewTransferDecisionDetail(page, 6);

    await page.locator('ul.ant-card-actions li:nth-child(4)').click();

    await page.getByRole('button', { name: 'Đồng ý' }).click();

    await checkMassage(page, 'Nộp đơn điều chuyển thành công');
});

//Test case
test('Phê duyệt đơn quyết định điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, 'Chris Hemsworth');
    //chuyển đến trang quản lý quyết định điều chuyển
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();

    await page.getByRole('button', { name: 'Tạo đơn quyết định' }).click();

    await page.locator('.ant-modal-content .ant-select-selector').click();

    //chọn đơn yêu cầu điều chuyển
    const selectTransfer = page.locator(`.ant-select-item-option-content:has-text('ID:24 - Chris Tom')`);
    while (await selectTransfer.isHidden()) {
        await page.keyboard.press('ArrowDown');
    }
    await selectTransfer.click();
    await page.getByRole('button', { name: 'Đồng ý' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    //Thực hiện phê duyệt đơn
    await viewTransferDecisionDetail(page, 6); //xem chi tiết đơn
    await page.locator('ul.ant-card-actions li:nth-child(4)').click();
    await page.getByRole('button', { name: 'Đồng ý' }).click();
    await login(page, 'Leah Zulauf');
    await page.getByRole('button', { name: 'Duyệt đơn' }).click();
    await page.locator('#remarks').fill('Oke nha em');
    //chọn hành động duyệt đơn
    await page.locator('.ant-select-selector .ant-select-selection-item').and(page.getByTitle("Bản nháp")).click();
    // Chọn mục "Đã phê duyệt"
    const approved = page.locator('.ant-select-item-option-content:has-text("Đã phê duyệt")');
    // Cuộn xuống nếu cần thiết và click vào mục này
    while (await approved.isHidden()) {
        await page.keyboard.press('ArrowDown');
    }
    // Click chọn "Đã phê duyệt"
    await approved.click();
    await page.getByRole('button', { name: 'Đồng ý' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    await page.locator('ant-card-head-title:hasText("Lịch sử duyệt đơn điều chuyển")');

    //Check duyệt đơn
    await login(page, 'Chris Hemsworth');
    // Mở dropdown thông báo (biểu tượng notification)
    await page.locator('.ant-btn .anticon-notification').click();
    // Chọn thông báo có chứa văn bản "Thông báo duyệt đơn yêu cầu ID: 6"
    const notification = page.locator('.ant-dropdown-menu-title-content:has-text("Thông báo duyệt đơn quyết định ID: 6")');
    await notification.click();
});
