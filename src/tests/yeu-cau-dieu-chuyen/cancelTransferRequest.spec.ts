import { test, expect } from '@playwright/test';
import {
    goToLastPage,
    login,
    checkMassage,
    getRowKeyByStatus,
    goToDetailById,
    notificationClick
} from './hepersTransferRequest'; // Import các hàm đã viết ở file helpers.ts

// Test phê duyệt hoặc từ chối yêu cầu
test('Test Nhân viên hủy đơn khi đang duyệt', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    //đến cuối bảng
    await goToLastPage(page);
    // Giả sử có logic để load dữ liệu của bảng, cần đợi bảng hiển thị đầy đủ
    await page.waitForSelector('.ant-table-row'); // Đảm bảo bảng đã load

    // Gọi hàm getRowKeyByStatus và kiểm tra kết quả
    const rowKey = await getRowKeyByStatus(page, 'Bản nháp');

    // Kiểm tra xem rowKey có giá trị hợp lệ hay không
    expect(rowKey).not.toBeNull();

    //lấy nhân viên
    const name = await page.locator(`table tbody tr[data-row-key="${rowKey}"] td:nth-child(2)`).textContent();

    // Gọi hàm đăng nhập
    await login(page, "Nhân viên", "", name || ""); // Gọi hàm đăng nhập

    // Gọi hàm xem chi tiết yêu cầu điều chuyển
    if (rowKey) {
        await goToDetailById(page, rowKey);
    } else {
        throw new Error("rowKey is null");
    }

    // Gửi yêu cầu phê duyệt
    await page.locator('ul.ant-card-actions li:nth-child(3)').click();

    await page.getByRole('button', { name: 'OK' }).click();
    //Check thông báo
    await checkMassage(page, 'Hủy đơn thành công');
});

// Test quản lý hủy duyệt đơn
test('Test quản lý hủy duyệt đơn', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    //đến cuối bảng
    await goToLastPage(page);
    // Giả sử có logic để load dữ liệu của bảng, cần đợi bảng hiển thị đầy đủ
    await page.waitForSelector('.ant-table-row'); // Đảm bảo bảng đã load

    // Gọi hàm getRowKeyByStatus và kiểm tra kết quả
    const rowKey = await getRowKeyByStatus(page, 'Chờ phê duyệt');

    // Kiểm tra xem rowKey có giá trị hợp lệ hay không
    expect(rowKey).not.toBeNull();

    //lấy nhân viên
    const name = await page.locator(`table tbody tr[data-row-key="${rowKey}"] td:nth-child(2)`).textContent();

    // Gọi hàm đăng nhập
    await login(page, "Nhân viên", "", name || ""); // Gọi hàm đăng nhập

    // Gọi hàm xem chi tiết yêu cầu điều chuyển
    if (rowKey) {
        await goToDetailById(page, rowKey);
    } else {
        throw new Error("rowKey is null");
    }

    // Duyệt đơn yêu cầu
    await login(page, "Quản lý", "Phòng kỹ thuật");
    await page.click('button:has-text("Duyệt đơn")');
    await page.fill('#remarks', 'Oke nha em');

    // Mở dropdown
    await page.locator('.ant-modal-content .ant-select-selector').click();

    // Chọn mục "Yêu cầu chỉnh sửa"
    await page.locator('.ant-select-item-option-content:has-text("Yêu cầu chỉnh sửa")').click();
    await page.click('button:has-text("Đồng ý")'); // Click nút Đồng ý trong modal phê duyệt yêu cầu
    await page.click('button:has-text("OK")'); // Nhấn nút "OK" trong modal xác nhận

    // Kiểm tra thông báo
    await checkMassage(page, 'Cập nhật thành công!');

    // Người tạo chỉnh lại đơn yêu cầu
    await login(page, "Nhân viên", "", name || "");

    await notificationClick(page);

    // Thực hiện chỉnh sửa đơn yêu cầu
    await page.locator('ul.ant-card-actions li:nth-child(2)').click(); // Chọn nút chỉnh sửa
    await page.fill('#positionTo', 'Nhân viên');  // Thay đổi chức vụ
    await page.getByRole('button', { name: 'Đồng ý' }).click();
    await page.click('button:has-text("OK")'); // Nhấn nút "OK"

    // Kiểm tra thông báo
    await checkMassage(page, 'Cập nhật thành công!');

    // Gửi yêu cầu phê duyệt
    await page.locator('ul.ant-card-actions li:last-child').click(); // Click nút "Gửi yêu cầu"
    await page.locator('button:has-text("Có, Nộp đơn")').click(); // Click nút "Có, Nộp đơn"

    // Kiểm tra thông báo
    await checkMassage(page, 'Chỉnh sửa đơn thành công');

    // Thực hiện duyệt lại đơn yêu cầu trên
    await login(page, "Quản lý", "Phòng kỹ thuật");

    await notificationClick(page);

    // Duyệt đơn yêu cầu
    await page.click('button:has-text("Duyệt đơn")');
    await page.fill('#remarks', 'Sory em anh bận rồi nha');

    // Mở dropdown
    await page.locator('.ant-select-selector .ant-select-selection-item').and(page.getByTitle("Bản nháp")).click();

    // Chọn mục "Đã phê duyệt"
    const approved = page.locator('.ant-select-item-option-content:has-text("Hủy")');
    await approved.click();

    // Nhấp vào nút "Đồng ý" trong modal phê duyệt yêu cầu
    await page.click('button:has-text("Đồng ý")');

    // Nhấp vào nút "OK" trong modal xác nhận
    await page.locator('.ant-modal-content button.ant-btn-primary:has-text("OK")').click();

    // Đăng nhập lại để kiểm tra thông báo
    await login(page, "Nhân viên", "", name || "");

    await notificationClick(page);
});