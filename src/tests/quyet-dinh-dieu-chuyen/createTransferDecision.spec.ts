import { login, viewTransferDecisionDetail, checkMassage, selectOptionLastItem } from "./hepersTransferDecisions"
import { test, expect } from '@playwright/test';

//Test case
test('Nhân viên nhân sự tạo đơn yêu cầu điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, 'Nhân viên', 'Phòng nhân sự');
    //chuyển đến trang quản lý quyết định điều chuyển
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();

    await page.getByRole('button', { name: 'Tạo đơn quyết định' }).click();

    await selectOptionLastItem(page);

    await page.getByRole('button', { name: 'Đồng ý' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    //check thông báo
    await checkMassage(page, 'Thêm quyết định điều chuyển mới thành công');

    await viewTransferDecisionDetail(page, 6);
});

//Test case
test('Gửi đơn quyết định điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, 'Nhân viên', 'Phòng nhân sự');
    //chuyển đến trang quản lý quyết định điều chuyển
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();

    await page.getByRole('button', { name: 'Tạo đơn quyết định' }).click();

    await selectOptionLastItem(page);

    await page.getByRole('button', { name: 'Đồng ý' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    //check thông báo
    await checkMassage(page, 'Thêm quyết định điều chuyển mới thành công');

    await viewTransferDecisionDetail(page, 6);

    await page.locator('ul.ant-card-actions li:nth-child(4)').click();

    await page.getByRole('button', { name: 'Đồng ý' }).click();

    await checkMassage(page, 'Nộp đơn điều chuyển thành công');
});

//Test case theo thất bại
//Test case
test('Nhân viên nhân sự tạo đơn yêu cầu điều chuyển không thành công', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, 'Nhân viên', 'Phòng nhân sự');
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

    await checkMassage(page, 'Error: Đã tồn tại quyết định điều chuyển cho yêu cầu này');

});

//Test case
test('Nhân viên tạo đơn không gửi đơn khi đã gửi đơn trước đó', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, 'Nhân viên', 'Phòng nhân sự');
    //chuyển đến trang quản lý quyết định điều chuyển
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();

    await page.getByRole('button', { name: 'Tạo đơn quyết định' }).click();

    await selectOptionLastItem(page);

    await page.getByRole('button', { name: 'Đồng ý' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    //check thông báo
    await checkMassage(page, 'Thêm quyết định điều chuyển mới thành công');

    // await waitForMinutes(page);
    await viewTransferDecisionDetail(page, 6);

    await page.locator('ul.ant-card-actions li:nth-child(4)').click();

    await page.getByRole('button', { name: 'Đồng ý' }).click();

    await checkMassage(page, 'Nộp đơn điều chuyển thành công');

    // Lấy nội dung của span
    const sendRequestButton = page.locator('ul.ant-card-actions li:nth-child(4) span');
    const spanContent = await sendRequestButton.evaluate((span) => span.innerHTML.trim());
    // Kiểm tra nếu span rỗng
    const isEmpty = spanContent === '';
    // Kiểm tra nếu span rỗng thì test sẽ pass, ngược lại fail
    expect(isEmpty).toBe(true);
});