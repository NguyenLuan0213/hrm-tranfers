import { test, expect } from '@playwright/test';
import {
    goToLastPage,
    login,
    checkMassage,
    getRowKeyByStatus,
    goToDetailById
} from './hepersTransferRequest'; // Import các hàm đã viết ở file helpers.ts

// Test phê duyệt hoặc từ chối yêu cầu
test('Test quá trình duyệt đơn yêu cầu điều chuyển', async ({ page }) => {
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
    await page.locator('ul.ant-card-actions li:last-child').click();

    const modalSendRequest = page.locator('.ant-modal-content');
    const submitButton = modalSendRequest.locator('button:has-text("Có, Nộp đơn")');
    await submitButton.click(); // Click nút Gửi yêu cầu

    //Check thông báo
    await checkMassage(page, 'Nộp đơn thành công');

    // Gọi hàm đăng nhập lại
    await login(page, "Quản lý", "Phòng kỹ thuật");

    // Duyệt đơn yêu cầu
    await page.click('button:has-text("Duyệt đơn")');

    await page.fill('#remarks', 'Oke nha em')

    // Mở dropdown
    const dropdown = page.locator('.ant-modal-content .ant-select-selector');
    await dropdown.click();

    // Chọn mục "Đã phê duyệt"
    const approvedOption = page.locator('.ant-select-item-option-content:has-text("Từ chối")');


    // Cuộn xuống nếu cần thiết và click vào mục này
    while (await approvedOption.isHidden()) {
        await page.keyboard.press('ArrowDown');
    }

    // Click chọn "Đã phê duyệt"
    await approvedOption.click();

    await page.click('button:has-text("Đồng ý")');

    await page.click('button:has-text("OK")');

    //Check thông báo
    await checkMassage(page, 'Cập nhật thành công!');
});
