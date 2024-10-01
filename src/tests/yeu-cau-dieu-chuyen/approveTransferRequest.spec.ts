import { test, expect } from '@playwright/test';
import {
    goToLastPage,
    login,
    goToDetailAfterCreate,
    checkMassage,
} from './hepersTransferRequest'; // Import các hàm đã viết ở file helpers.ts

// Test phê duyệt hoặc từ chối yêu cầu
test('Test quá trình duyệt đơn yêu cầu điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Gọi hàm đăng nhập
    await login(page, "Nhân viên", "Phòng kế toán"); // Gọi hàm đăng nhập

    // Mở modal thêm yêu cầu điều chuyển
    await page.click('button:has-text("Tạo đơn yêu cầu")')

    // Chọn phòng ban
    await page.click('#departmentIdTo');// Chọn option
    const optionLocatorDepartment = page.locator('.ant-select-item-option-content:has-text("Phòng nhân sự (ID: 2)")'); // Chọn phòng nhân sự
    await optionLocatorDepartment.click();

    // Điền thông tin
    await page.fill('#positionTo', 'Quản lý'); // Điền chức vụ
    await page.click('button:has-text("Đồng ý")'); // Click nút Đồng ý
    await page.click('button:has-text("OK")'); // Click nút OK

    // Kiểm tra thông báo
    await checkMassage(page, 'Thêm yêu cầu điều chuyển mới thành công');

    // Gọi hàm xem chi tiết yêu cầu điều chuyển
    await goToLastPage(page); // Gọi lại hàm chuyển đến trang cuối

    // Gọi hàm xem chi tiết yêu cầu điều chuyển
    await goToDetailAfterCreate(page);

    // Gửi yêu cầu phê duyệt
    await page.locator('ul.ant-card-actions li:last-child').click();

    const modalSendRequest = page.locator('.ant-modal-content');
    const submitButton = modalSendRequest.locator('button:has-text("Có, Nộp đơn")');
    await submitButton.click(); // Click nút Gửi yêu cầu

    //Check thông báo
    await checkMassage(page, 'Nộp đơn thành công');

    // Gọi hàm đăng nhập lại
    await login(page, "Quản lý", "Phòng kế toán");

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