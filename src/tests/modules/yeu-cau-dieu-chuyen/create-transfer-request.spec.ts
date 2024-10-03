import { test, expect } from '@playwright/test';
import {
    goToLastPage,
    login,
    checkMassage,
    goToDetailById,
    getRowKeyByStatus,

} from './helpers/hepers-transfer-request'; // Import các hàm đã viết ở file helpers.ts

//Các test case theo hướng đúng
// Test case
test('Tạo yêu cầu điều chuyển với đầy đủ thông tin', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Gọi hàm đăng nhập
    await login(page, "Nhân viên", "Phòng kế toán"); // Gọi hàm đăng nhập

    // Mở modal thêm yêu cầu điều chuyển
    await page.click('button:has-text("Tạo đơn yêu cầu")')

    //chọn phòng ban
    await page.click('#departmentIdTo');// Chọn option
    const optionLocatorDepartment = page.locator('.ant-select-item-option-content:has-text("Phòng nhân sự (ID: 2)")'); // Chọn phòng nhân sự
    await optionLocatorDepartment.click();

    // Điền thông tin
    await page.fill('#positionTo', 'Quản lý'); // Điền chức vụ
    await page.click('button:has-text("Đồng ý")'); // Click nút Đồng ý
    await page.click('button:has-text("OK")'); // Click nút OK

    // Kiểm tra thông báo
    const message = await page.innerText('.ant-message-custom-content');
    expect(message).toContain('Thêm yêu cầu điều chuyển mới thành công');
});

//Test case trường hơp sai thông tin
// Test case
test('Tạo yêu cầu điều chuyển với thiếu thông tin', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Đăng nhập
    await login(page, "Nhân viên", "Phòng kế toán"); // Gọi hàm đăng nhập

    // Mở modal thêm yêu cầu điều chuyển
    await page.click('button:has-text("Tạo đơn yêu cầu")')

    //chọn phòng ban
    await page.click('#departmentIdTo');// Chọn option
    const optionLocatorDepartment = page.locator('.ant-select-item-option-content:has-text("Phòng nhân sự (ID: 2)")'); // Chọn phòng nhân sự
    await optionLocatorDepartment.click();

    // Click nút Đồng ý
    await page.click('button:has-text("Đồng ý")');

    // Kiểm tra thông báo lỗi
    const errorLocator = await page.waitForSelector('#positionTo_help .ant-form-item-explain-error');
    const message = await errorLocator.textContent();
    expect(message).toContain("Vui lòng nhập chức vụ đến!");
});

//Test nhân viên không thể tạo 2 yêu cầu điều chuyển cùng lúc
test('Nhân viên không thể tạo 2 yêu cầu điều chuyển cùng lúc', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Gọi hàm đăng nhập
    await login(page, "Nhân viên", "Phòng kế toán"); // Gọi hàm đăng nhập

    // Mở modal thêm yêu cầu điều chuyển
    await page.click('button:has-text("Tạo đơn yêu cầu")')

    //chọn phòng ban
    await page.click('#departmentIdTo');// Chọn option
    const optionLocatorDepartment = page.locator('.ant-select-item-option-content:has-text("Phòng nhân sự (ID: 2)")'); // Chọn phòng nhân sự
    await optionLocatorDepartment.click();

    // Điền thông tin
    await page.fill('#positionTo', 'Quản lý'); // Điền chức vụ
    await page.click('button:has-text("Đồng ý")'); // Click nút Đồng ý
    await page.click('button:has-text("OK")'); // Click nút OK

    // Kiểm tra thông báo
    const message = await page.innerText('.ant-message-custom-content');
    expect(message).toContain('Thêm yêu cầu điều chuyển mới thành công');

    // Mở modal thêm yêu cầu điều chuyển
    await page.click('button:has-text("Tạo đơn yêu cầu")')

    // Điền thông tin
    await page.click('button:has-text("Đồng ý")'); // Click nút Đồng ý
    await page.click('button:has-text("OK")'); // Click nút OK

    // Kiểm tra thông báo
    await checkMassage(page, 'Thêm yêu cầu điều chuyển mới thất bại : Error: Đã tồn tại một yêu cầu đang xử lý của bạn');
});

//Test trường hợp không thể gửi đơn khi đã gửi đơn trước đó
test('Không thể gửi đơn khi đã gửi đơn trước đó', async ({ page }) => {
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

    // Lấy nội dung của span
    const sendRequestButton = page.locator('ul.ant-card-actions li:last-child span');
    const spanContent = await sendRequestButton.evaluate((span) => span.innerHTML.trim());
    // Kiểm tra nếu span rỗng
    const isEmpty = spanContent === '';
    // Kiểm tra nếu span rỗng thì test sẽ pass, ngược lại fail
    expect(isEmpty).toBe(true);

});

