import { test, expect } from '@playwright/test';
import {
    login,
    goToDetailAfterCreate,
    checkMassage,
    notificationClick
} from './hepersTransferRequest'; // Import các hàm đã viết ở file helpers.ts

// Test phê duyệt có yêu cầu điều chỉnh
test('Test quá trình phê duyệt yêu cầu điều chuyển có yêu cầu duyệt lại đơn', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Gọi hàm đăng nhập
    await login(page, "Nhân viên", "Phòng kế toán"); // Gọi hàm đăng nhập

    // Mở modal thêm yêu cầu điều chuyển
    await page.click('button:has-text("Tạo đơn yêu cầu")');

    // Chọn phòng ban
    await page.click('#departmentIdTo'); // Chọn option
    await page.locator('.ant-select-item-option-content:has-text("Phòng nhân sự (ID: 2)")').click(); // Chọn phòng nhân sự

    // Điền thông tin
    await page.fill('#positionTo', 'Quản lý'); // Điền chức vụ
    await page.click('button:has-text("Đồng ý")'); // Click nút Đồng ý
    await page.click('button:has-text("OK")'); // Click nút OK

    // Kiểm tra thông báo
    await checkMassage(page, 'Thêm yêu cầu điều chuyển mới thành công');

    // Gọi hàm xem chi tiết yêu cầu điều chuyển
    await goToDetailAfterCreate(page);

    // Gửi yêu cầu phê duyệt
    await page.locator('ul.ant-card-actions li:last-child').click();
    await page.locator('button:has-text("Có, Nộp đơn")').click(); // Click nút Gửi yêu cầu

    // Kiểm tra thông báo
    await checkMassage(page, 'Nộp đơn thành công');

    // Duyệt đơn yêu cầu
    await login(page, "Quản lý", "Phòng kế toán");
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
    await login(page, "Nhân viên", "Phòng kế toán");

    // Mở dropdown thông báo (biểu tượng notification)
    // await page.locator('.ant-btn .anticon-notification').click();
    // const notification = page.locator('.ant-dropdown-menu-item:has-text("Thông báo duyệt đơn yêu cầu ID")');
    // await notification.click();
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
    await login(page, "Quản lý", "Phòng kế toán");

    // Chọn thông báo có chứa văn bản "Thông báo duyệt đơn yêu cầu ID"
    // await page.locator('.ant-btn .anticon-notification').click();
    // await notification.click();
    await notificationClick(page);

    // Duyệt đơn yêu cầu
    await page.click('button:has-text("Duyệt đơn")');
    await page.fill('#remarks', 'Oke nha em');

    // Mở dropdown
    await page.locator('.ant-select-selector .ant-select-selection-item').and(page.getByTitle("Bản nháp")).click();

    // Chọn mục "Đã phê duyệt"
    const approved = page.locator('.ant-select-item-option-content:has-text("Đã phê duyệt")');
    await approved.click();

    // Nhấp vào nút "Đồng ý" trong modal phê duyệt yêu cầu
    await page.click('button:has-text("Đồng ý")');

    // Nhấp vào nút "OK" trong modal xác nhận
    await page.locator('.ant-modal-content button.ant-btn-primary:has-text("OK")').click();

    // Đăng nhập lại để kiểm tra thông báo
    await login(page, "Nhân viên", "Phòng kế toán");
    // await page.locator('.ant-btn .anticon-notification').click();
    // await notification.click();
    await notificationClick(page);
});