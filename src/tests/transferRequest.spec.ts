import { test, expect } from '@playwright/test';
import {
    goToLastPage,
    login,
    waitForMinutes,
    viewTransferRequestDetail,
    goToDetailAfterCreate,
    checkMassage,

} from './hepersTransferRequest'; // Import các hàm đã viết ở file helpers.ts

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

// Test case
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

// Test case
test('Test trưởng bộ phận không thể xem danh sách các yêu cầu điều chuyển của bộ phận khác', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Đăng nhập
    await login(page, "Quản lý", "Phòng kỹ thuật"); // Gọi hàm đăng nhập

    // Kiểm tra danh sách yêu cầu điều chuyển, tìm nút "Chi tiết" liên quan đến yêu cầu điều chuyển của bộ phận khác
    await viewTransferRequestDetail(page, 1);
});

// Test chuyển sang trang cuối
test('Test chuyển page sang trang cuối', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển
    // Đăng nhập
    await login(page, "Nhân viên", "Phòng nhân sự"); // Gọi hàm đăng nhập

    await goToLastPage(page); // Gọi lại hàm chuyển đến trang cuối
});

// Test xem chi tiết yêu cầu điều chuyển
test('Test nhân viên tạo có thể xem chi tiết yêu cầu điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Gọi hàm đăng nhập
    await login(page, "Nhân viên", "Phòng kế toán"); // Gọi hàm đăng nhập

    // Gọi hàm xem chi tiết yêu cầu điều chuyển
    await viewTransferRequestDetail(page, 1); // Gọi hàm xem chi tiết yêu cầu điều chuyển
});

// Test phê duyệt hoặc từ chối yêu cầu
test('Test quá trình gửi yêu cầu phê duyệt', async ({ page }) => {
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
    const message = await page.innerText('.ant-message-custom-content');
    expect(message).toContain('Thêm yêu cầu điều chuyển mới thành công');

    // Gọi hàm xem chi tiết yêu cầu điều chuyển
    if (message.includes('Thêm yêu cầu điều chuyển mới thành công')) {
        await goToLastPage(page); // Gọi lại hàm chuyển đến trang cuối

        // Gọi hàm xem chi tiết yêu cầu điều chuyển
        await goToDetailAfterCreate(page);

        // Gửi yêu cầu phê duyệt
        const sendRequestButton = page.locator('ul.ant-card-actions li:last-child');
        await sendRequestButton.click();

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
    }
});

// Test phê duyệt có yêu cầu điều chỉnh
test('Test quá trình phê duyệt yêu cầu có hoạt động đúng không', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Gọi hàm đăng nhập
    await login(page, "Nhân viên", "Phòng kế toán"); // Gọi hàm đăng nhập

    // Mở modal thêm yêu cầu điều chuyển
    await page.click('button:has-text("Tạo đơn yêu cầu")');

    // Chọn phòng ban
    await page.click('#departmentIdTo'); // Chọn option
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
    const approvedOption = page.locator('.ant-select-item-option-content:has-text("Yêu cầu chỉnh sửa")');
    await approvedOption.click();

    await page.click('button:has-text("Đồng ý")'); // Click nút Đồng ý trong modal phê duyệt yêu cầu
    await page.click('button:has-text("OK")'); // Nhấn nút "OK" trong modal xác nhận

    // Đợi modal cũ đóng hoàn toàn trước khi tiếp tục
    await page.waitForSelector('.ant-modal-content', { state: 'hidden' });

    // Kiểm tra thông báo
    await checkMassage(page, 'Cập nhật thành công!');

    // Người tạo chỉnh lại đơn yêu cầu
    await login(page, "Nhân viên", "Phòng kế toán");

    // Mở dropdown thông báo (biểu tượng notification)
    await page.locator('.ant-btn .anticon-notification').click();
    const notification = page.locator('.ant-dropdown-menu-item:has-text("Thông báo duyệt đơn yêu cầu ID")');
    await notification.click();

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
    await page.locator('.ant-btn .anticon-notification').click();
    await notification.click();

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
    await page.locator('.ant-btn .anticon-notification').click();
    await notification.click();
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


