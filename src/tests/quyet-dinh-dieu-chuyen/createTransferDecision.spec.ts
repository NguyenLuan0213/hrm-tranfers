import { login, viewTransferDecisionDetail, checkMassage, selectOptionLastItem, viewDetailAfterCreate, goToLastPage, getRowKeyByStatus } from "./hepersTransferDecisions"
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

    await viewDetailAfterCreate(page);
});

//Test case
test('Gửi đơn quyết định điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, 'Nhân viên', 'Phòng nhân sự');
    //chuyển đến trang quản lý quyết định điều chuyển
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();
    
    //đến cuối bảng
    await goToLastPage(page);

    await page.waitForSelector('.ant-table-row'); // Đảm bảo bảng đã load

    // Gọi hàm getRowKeyByStatus và kiểm tra kết quả
    const rowKey = await getRowKeyByStatus(page, 'Bản nháp');

    // Gọi hàm xem chi tiết yêu cầu điều chuyển
    if (!rowKey) {
        return console.error("Không có yêu cầu nào ở trạng thái Chờ phê duyệt");
    }

    //lấy nhân viên
    const name = await page.locator(`table tbody tr[data-row-key="${rowKey}"] td:nth-child(3)`).textContent();

    // Gọi hàm đăng nhập
    await login(page, "Nhân viên", "", name || ""); // Gọi hàm đăng nhập

    await viewTransferDecisionDetail(page, Number(rowKey));

    await page.locator('ul.ant-card-actions li:nth-child(4)').click();

    await page.getByRole('button', { name: 'Đồng ý' }).click();

    await checkMassage(page, 'Nộp đơn điều chuyển thành công');
});

//Test theo kịch bản thất bại
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
    
    //đến cuối bảng
    await goToLastPage(page);

    await page.waitForSelector('.ant-table-row'); // Đảm bảo bảng đã load

    // Gọi hàm getRowKeyByStatus và kiểm tra kết quả
    const rowKey = await getRowKeyByStatus(page, 'Chờ phê duyệt');

    // Gọi hàm xem chi tiết yêu cầu điều chuyển
    if (!rowKey) {
        return console.error("Không có yêu cầu nào ở trạng thái Chờ phê duyệt");
    }

    //lấy nhân viên
    const name = await page.locator(`table tbody tr[data-row-key="${rowKey}"] td:nth-child(3)`).textContent();

    // Gọi hàm đăng nhập
    await login(page, "Nhân viên", "", name || ""); // Gọi hàm đăng nhập

    await viewTransferDecisionDetail(page, Number(rowKey));

    // Lấy nội dung của span
    const sendRequestButton = page.locator('ul.ant-card-actions li:nth-child(4) span');
    const spanContent = await sendRequestButton.evaluate((span) => span.innerHTML.trim());
    // Kiểm tra nếu span rỗng
    const isEmpty = spanContent === '';
    // Kiểm tra nếu span rỗng thì test sẽ pass, ngược lại fail
    expect(isEmpty).toBe(true);
});