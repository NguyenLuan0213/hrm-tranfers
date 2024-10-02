import { test, expect } from '@playwright/test';
import {  login, viewTransferRequestDetail } from './hepersTransferRequest';

// Test trưởng bộ phận có thể xem danh sách các yêu cầu điều chuyển
test('Test trưởng bộ phận có thể xem danh sách các yêu cầu điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Đăng nhập
    await login(page, "Quản lý", "Phòng kế toán"); // Gọi hàm đăng nhập

    // Kiểm tra danh sách yêu cầu điều chuyển, tìm nút "Chi tiết" liên quan đến yêu cầu điều chuyển đầu tiên
    const chiTietButton = page.locator('table tbody tr:first-child button:has-text("Chi tiết")');

    // Kiểm tra xem nút "Chi tiết" có hiển thị (enabled) không, tức là trưởng bộ phận có thể click
    const isDisabled = await chiTietButton.isDisabled();
    if (!isDisabled) {
        // Nhấp vào nút "Chi tiết"
        await chiTietButton.click();

        // Xác nhận đã điều hướng thành công đến trang chi tiết
        const backButton = page.locator('ul.ant-card-actions li:first-child');
        await backButton.click();
    } else {
        throw new Error("Trưởng bộ phận không thể xem chi tiết yêu cầu điều chuyển");
    }
});

// Test trưởng bộ phận không thể xem danh sách các yêu cầu điều chuyển của bộ phận khác
test('Test trưởng bộ phận không thể xem danh sách các yêu cầu điều chuyển của bộ phận khác', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Đăng nhập
    await login(page, "Quản lý", "Phòng kỹ thuật"); // Gọi hàm đăng nhập

    // Kiểm tra danh sách yêu cầu điều chuyển, tìm nút "Chi tiết" liên quan đến yêu cầu điều chuyển của bộ phận khác
    await viewTransferRequestDetail(page, 1);
});

//Test trường hợp không thể xem chi tiết yêu cầu điều chuyển
test('Test trường hợp không thể xem chi tiết yêu cầu điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Đăng nhập
    await login(page, "Nhân viên", "Phòng kế toán"); // Gọi hàm đăng nhập

    // Kiểm tra danh sách yêu cầu điều chuyển, tìm nút "Chi tiết" liên quan đến yêu cầu điều chuyển đầu tiên
    await viewTransferRequestDetail(page, 2);
});

//Test trưởng phòng và quản lý có xem được lịch sử yêu cầu điều chuyển không
test('Test trưởng phòng và quản lý có xem được lịch sử yêu cầu điều chuyển không', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Đăng nhập
    await login(page, "Quản lý", "Phòng kế toán"); // Gọi hàm đăng nhập

    // Mở dropdown
    await viewTransferRequestDetail(page, 1);

    const history = await page.textContent('.ant-card-head-title:has-text("Lịch sử duyệt đơn điều chuyển")');
    expect(history).toContain('Lịch sử duyệt đơn điều chuyển');

    //Thêm phòng nhân sự
    await login(page, "Quản lý", "Phòng nhân sự"); // Gọi hàm đăng nhập
    expect(history).toContain('Lịch sử duyệt đơn điều chuyển');
});

// Test xem chi tiết yêu cầu điều chuyển
test('Test nhân viên tạo có thể xem chi tiết yêu cầu điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Gọi hàm đăng nhập
    await login(page, "Nhân viên", "Phòng kế toán"); // Gọi hàm đăng nhập

    // Gọi hàm xem chi tiết yêu cầu điều chuyển
    await viewTransferRequestDetail(page, 1); // Gọi hàm xem chi tiết yêu cầu điều chuyển
});
