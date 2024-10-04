import { login, viewTransferDecisionDetail, checkMessage, notificationClick, getRowKeyByStatus, goToLastPage } from "./helpers/helpers-transfer-decisions"
import { test } from '@playwright/test';

//Hủy đơn đã tạo
test('Hủy đơn tạo quyết định điều chuyển', async ({ page }) => {
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

    await page.locator('ul.ant-card-actions li:nth-child(3)').click();
    await page.getByRole('button', { name: 'Đồng ý' }).click();

    await checkMessage(page, 'Hủy đơn điều chuyển thành công');
});

//Hủy đơn đang duyệt
test('Hủy phê duyệt đơn quyết định điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, 'Nhân viên', 'Phòng nhân sự');
    //chuyển đến trang quản lý quyết định điều chuyển
    await page.locator('ul.ant-menu-root li:has-text("Quyết định điều chuyển")').click();
    
    //đến cuối bảng
    await goToLastPage(page);

    await page.waitForSelector('.ant-table-row'); // Đảm bảo bảng đã load

    // Gọi hàm getRowKeyByStatus và kiểm tra kết quả
    const rowKey = await getRowKeyByStatus(page, 'Yêu cầu điều chỉnh');

    // Gọi hàm xem chi tiết yêu cầu điều chuyển
    if (!rowKey) {
        return console.error("Không có yêu cầu nào ở trạng thái trên");
    }

    //lấy nhân viên
    const name = await page.locator(`table tbody tr[data-row-key="${rowKey}"] td:nth-child(3)`).textContent();

    // Gọi hàm đăng nhập
    await login(page, "Nhân viên", "", name || ""); // Gọi hàm đăng nhập

    await viewTransferDecisionDetail(page, Number(rowKey));

    //Thực hiện gửi đơn
    await page.locator('ul.ant-card-actions li:nth-child(4)').click();
    await page.getByRole('button', { name: 'Đồng ý' }).click();
    await checkMessage(page, 'Nộp đơn điều chuyển thành công');

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
    await checkMessage(page, 'Duyệt đơn thành công');

    //Check duyệt đơn
    await login(page, "Nhân viên", "", name || ""); // Gọi hàm đăng nhập
    // Mở dropdown thông báo (biểu tượng notification)
    await notificationClick(page);
});