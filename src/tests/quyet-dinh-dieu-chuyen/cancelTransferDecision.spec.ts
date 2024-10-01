import { login, viewTransferDecisionDetail, checkMassage, selectOptionLastItem, notificationClick } from "./hepersTransferDecisions"
import { test } from '@playwright/test';

//Hủy đơn đã tạo
test('Hủy đơn tạo quyết định điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, 'Nhân viên', 'Phòng nhân sự');
    //chuyển đến trang quản lý quyết định điều chuyển
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();

    await page.getByRole('button', { name: 'Tạo đơn quyết định' }).click();

    await page.locator('.ant-modal-content .ant-select-selector').click();

    //chọn đơn yêu cầu điều chuyển
    await selectOptionLastItem(page);
    await page.getByRole('button', { name: 'Đồng ý' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    await checkMassage(page, 'Thêm quyết định điều chuyển mới thành công');

    //Thực hiện phê duyệt đơn
    await viewTransferDecisionDetail(page, 6); //xem chi tiết đơn
    await page.locator('ul.ant-card-actions li:nth-child(3)').click();
    await page.getByRole('button', { name: 'Đồng ý' }).click();

    await checkMassage(page, 'Hủy đơn điều chuyển thành công');
});

//Hủy đơn đang duyệt
test('Hủy phê duyệt đơn quyết định điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, 'Nhân viên', 'Phòng nhân sự');
    //chuyển đến trang quản lý quyết định điều chuyển
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();

    await page.getByRole('button', { name: 'Tạo đơn quyết định' }).click();

    //chọn đơn yêu cầu điều chuyển
    await selectOptionLastItem(page);
    await page.getByRole('button', { name: 'Đồng ý' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    await checkMassage(page, 'Thêm quyết định điều chuyển mới thành công');

    //Thực hiện phê duyệt đơn
    await viewTransferDecisionDetail(page, 6); //xem chi tiết đơn
    await page.locator('ul.ant-card-actions li:nth-child(4)').click();
    await page.getByRole('button', { name: 'Đồng ý' }).click();

    await checkMassage(page, 'Nộp đơn điều chuyển thành công');

    await login(page, 'Ban giám đốc', 'Phòng giám đốc');
    await page.getByRole('button', { name: 'Duyệt đơn' }).click();
    await page.locator('#remarks').fill('Oke nha em');
    //chọn hành động duyệt đơn
    await page.locator('.ant-select-selector .ant-select-selection-item').and(page.getByTitle("Bản nháp")).click();
    // Chọn mục "Đã phê duyệt"
    const approved = page.locator('.ant-select-item-option-content:has-text("Yêu cầu chỉnh sửa")');
    // Cuộn xuống nếu cần thiết và click vào mục này
    while (await approved.isHidden()) {
        await page.keyboard.press('ArrowDown');
    }
    // Click chọn "Đã phê duyệt"
    await approved.click();
    await page.getByRole('button', { name: 'Đồng ý' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    await checkMassage(page, 'Duyệt đơn thành công');

    //Check duyệt đơn
    await login(page, 'Nhân viên', 'Phòng nhân sự');
    // Mở dropdown thông báo (biểu tượng notification)
    await page.locator('.ant-btn .anticon-notification').click();
    // Chọn thông báo có chứa văn bản "Thông báo duyệt đơn yêu cầu ID: 6"
    await notificationClick(page);

    //Thực hiện gửi đơn
    await page.locator('ul.ant-card-actions li:nth-child(4)').click();
    await page.getByRole('button', { name: 'Đồng ý' }).click();
    await checkMassage(page, 'Nộp đơn điều chuyển thành công');

    //Duyệt đơn
    await login(page, 'Ban giám đốc', 'Phòng giám đốc');
    await notificationClick(page);
    await page.getByRole('button', { name: 'Duyệt đơn' }).click();
    await page.locator('#remarks').fill('Anh hết thời gian rồi');
    //chọn hành động duyệt đơn
    await page.locator('.ant-select-selector .ant-select-selection-item').and(page.getByTitle("Bản nháp")).click();

    // Chọn mục "Đã phê duyệt"
    const approved2 = page.locator('.ant-select-item-option-content:has-text("Hủy")');
    // Cuộn xuống nếu cần thiết và click vào mục này
    while (await approved2.isHidden()) {
        await page.keyboard.press('ArrowDown');
    }
    // Click chọn "Đã phê duyệt"
    await approved2.click();

    await page.getByRole('button', { name: 'Đồng ý' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    //Kiểm tra thông báo
    await checkMassage(page, 'Duyệt đơn thành công');

    //Check duyệt đơn
    await login(page, 'Nhân viên', 'Phòng nhân sự');
    // Mở dropdown thông báo (biểu tượng notification)
    await notificationClick(page);
});