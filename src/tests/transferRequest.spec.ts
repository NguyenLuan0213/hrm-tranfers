import { test, expect } from '@playwright/test';
import {
    goToLastPage,
    login,
    waitForMinutes,
    viewTransferRequestDetail,
    goToDetailAfterCreate,
} from './hepers'; // Import các hàm đã viết ở file helpers.ts

// Test case
test('Tạo yêu cầu điều chuyển với đầy đủ thông tin', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Gọi hàm đăng nhập
    await login(page, "Alex Morgan");

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

    // Gọi hàm chờ trang xem kết quả
    await waitForMinutes(page);
});

// Test case
test('Tạo yêu cầu điều chuyển với thiếu thông tin', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Đăng nhập
    await login(page, "Alex Morgan"); // Gọi hàm đăng nhập

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

    await waitForMinutes(page);
});

// Test case
test('Test trưởng bộ phận có thể xem danh sách các yêu cầu điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Đăng nhập
    await login(page, "Jerome Mann"); // Gọi hàm đăng nhập

    // Kiểm tra danh sách yêu cầu điều chuyển, tìm nút "Chi tiết" liên quan đến yêu cầu điều chuyển đầu tiên
    const chiTietButton = page.locator('table tbody tr:first-child button:has-text("Chi tiết")');

    // Kiểm tra xem nút "Chi tiết" có hiển thị (enabled) không, tức là trưởng bộ phận có thể click
    const isDisabled = await chiTietButton.isDisabled();
    if (!isDisabled) {
        // Nhấp vào nút "Chi tiết"
        await chiTietButton.click();
        await waitForMinutes(page);

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
    await login(page, "Jerome Mann"); // Gọi hàm đăng nhập

    // Kiểm tra danh sách yêu cầu điều chuyển, tìm nút "Chi tiết" liên quan đến yêu cầu điều chuyển của bộ phận khác
    const chiTietButton = page.locator('table tbody tr[data-row-key="5"] button:has-text("Chi tiết")'); // Thay đổi data-row-key này thành data-row-key của yêu cầu điều chuyển của bộ phận khác

    // Kiểm tra xem nút "Chi tiết" có hiển thị (enabled) không, tức là trưởng bộ phận có thể click
    const isDisabled = await chiTietButton.isDisabled();
    if (!isDisabled) {
        throw new Error("Trưởng bộ phận có thể xem yêu cầu điều chuyển của bộ phận khác");
    }
});

// Test chuyển sang trang cuối
test('Test chuyển page sang trang cuối', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển
    // Đăng nhập
    await login(page, "Jerome Mann"); // Gọi hàm đăng nhập

    await goToLastPage(page); // Gọi lại hàm chuyển đến trang cuối
});

// Test xem chi tiết yêu cầu điều chuyển
test('Test xem chi tiết yêu cầu điều chuyển', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Gọi hàm đăng nhập
    await login(page, "Alex Morgan");
    await waitForMinutes(page);

    // Gọi hàm xem chi tiết yêu cầu điều chuyển
    await viewTransferRequestDetail(page, 2); // Gọi hàm xem chi tiết yêu cầu điều chuyển
});

// Test phê duyệt hoặc từ chối yêu cầu
test('Test quá trình gửi yêu cầu phê duyệt', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Gọi hàm đăng nhập
    await login(page, "Alex Morgan");

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
        await waitForMinutes(page);
        await goToLastPage(page); // Gọi lại hàm chuyển đến trang cuối

        // Gọi hàm xem chi tiết yêu cầu điều chuyển
        await goToDetailAfterCreate(page);

        // Gửi yêu cầu phê duyệt
        const sendRequestButton = page.locator('ul.ant-card-actions li:last-child');
        await sendRequestButton.click();

        const modalSendRequest = page.locator('.ant-modal-content');
        const submitButton = modalSendRequest.locator('button:has-text("Có, Nộp đơn")');
        await submitButton.click(); // Click nút Gửi yêu cầu

        // Kiểm tra thông báo
        const message = await page.innerText('.ant-message-custom-content');
        expect(message).toContain('Nộp đơn thành công');
        await waitForMinutes(page);

        // Gọi hàm đăng nhập lại
        await login(page, "Jerome Mann");

        // Duyệt đơn yêu cầu
        await page.click('button:has-text("Duyệt đơn")');

        await page.fill('#remarks', 'Oke nha em')

        // Mở dropdown
        const dropdown = page.locator('.ant-modal-content .ant-select-selector');
        await dropdown.click();

        // Chọn mục "Đã phê duyệt"
        // const approvedOption = page.locator('.ant-select-item-option-content:has-text("Đã phê duyệt")');
        const approvedOption = page.locator('.ant-select-item-option-content:has-text("Từ chối")');


        // Cuộn xuống nếu cần thiết và click vào mục này
        while (await approvedOption.isHidden()) {
            await page.keyboard.press('ArrowDown');
        }

        // Click chọn "Đã phê duyệt"
        await approvedOption.click();

        await page.click('button:has-text("Đồng ý")');

        await page.click('button:has-text("OK")');

        // Kiểm tra thông báo
        const messageApprove = await page.innerText('.ant-message-custom-content');
        expect(messageApprove).toContain('Cập nhật thành công!');
    }
});

// Test phê duyệt có yêu cầu điều chỉnh
test('Test quá trình phê duyệt yêu cầu có hoạt động đúng không', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Gọi hàm đăng nhập
    await login(page, "Alex Morgan");

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
    const messageAdd = await page.innerText('.ant-message-custom-content');
    expect(messageAdd).toContain('Thêm yêu cầu điều chuyển mới thành công');

    // Gọi hàm xem chi tiết yêu cầu điều chuyển
    if (messageAdd.includes('Thêm yêu cầu điều chuyển mới thành công')) {
        await waitForMinutes(page);
        await goToLastPage(page); // Gọi lại hàm chuyển đến trang cuối

        // Gọi hàm xem chi tiết yêu cầu điều chuyển
        await goToDetailAfterCreate(page);
    }

    // Gửi yêu cầu phê duyệt
    const sendRequestButton = page.locator('ul.ant-card-actions li:last-child');
    await sendRequestButton.click();

    const modalSendRequest = page.locator('.ant-modal-content');
    const submitButton = modalSendRequest.locator('button:has-text("Có, Nộp đơn")');
    await submitButton.click(); // Click nút Gửi yêu cầu

    // Kiểm tra thông báo
    const messageSend = await page.innerText('.ant-message-custom-content');
    expect(messageSend).toContain('Nộp đơn thành công');
    await waitForMinutes(page);

    // Duyệt đơn yêu cầu
    await login(page, "Jerome Mann");

    // Duyệt đơn yêu cầu
    await page.click('button:has-text("Duyệt đơn")');

    await page.fill('#remarks', 'Oke nha em');

    // Mở dropdown
    const dropdown = page.locator('.ant-modal-content .ant-select-selector');
    await dropdown.click();

    // Chọn mục "Yêu cầu chỉnh sửa"
    const approvedOption = page.locator('.ant-select-item-option-content:has-text("Yêu cầu chỉnh sửa")');

    // Cuộn xuống nếu cần thiết và click vào mục này
    while (await approvedOption.isHidden()) {
        await page.keyboard.press('ArrowDown');
    }

    // Click chọn "Yêu cầu chỉnh sửa"
    await approvedOption.click();

    await page.click('button:has-text("Đồng ý")'); // Click nút Đồng ý trong modal phê duyệt yêu cầu

    await page.click('button:has-text("OK")'); // Nhấn nút "OK" trong modal xác nhận

    // Đợi modal cũ đóng hoàn toàn trước khi tiếp tục
    await page.waitForSelector('.ant-modal-content', { state: 'hidden' });

    // Kiểm tra thông báo
    const messageApprove = await page.innerText('.ant-message-custom-content');
    expect(messageApprove).toContain('Cập nhật thành công!');

    // Người tạo chỉnh lại đơn yêu cầu
    await login(page, "Alex Morgan");

    // Mở dropdown thông báo (biểu tượng notification)
    await page.locator('.ant-btn .anticon-notification').click();

    // Chọn thông báo có chứa văn bản "Thông báo duyệt đơn yêu cầu ID: 25"
    const notification = page.locator('.ant-dropdown-menu-item:has-text("Thông báo duyệt đơn yêu cầu ID: 25")');
    await notification.click();

    // Thực hiện chỉnh sửa đơn yêu cầu
    await page.locator('ul.ant-card-actions li:nth-child(2)').click(); // Chọn nút chỉnh sửa

    await page.fill('#positionTo', 'Nhân viên');  // Thay đổi chức vụ

    // Click nút "Đồng ý"
    // await page.getByRole('button').click();
    await page.getByRole('button', { name: 'Đồng ý' }).click();

    // Nhấn nút "OK" trong modal xác nhận
    await page.click('button:has-text("OK")'); // Nhấn nút "OK"

    // Kiểm tra thông báo
    const messageUpdate = await page.innerText('.ant-message-custom-content');
    expect(messageUpdate).toContain('Cập nhật thành công!');

    await waitForMinutes(page);

    // Gửi yêu cầu phê duyệt
    await page.locator('ul.ant-card-actions li:last-child').click(); // Click nút "Gửi yêu cầu"
    await page.locator('button:has-text("Có, Nộp đơn")').click(); // Click nút "Có, Nộp đơn"

    await waitForMinutes(page);

    expect(await page.innerText('.ant-message-custom-content')).toContain('Chỉnh sửa đơn thành công');

    //thực hiện duyệt lại đơn yêu cầu trên
    await login(page, "Jerome Mann");

    // Chọn thông báo có chứa văn bản "Thông báo duyệt đơn yêu cầu ID: 25"
    await page.locator('.ant-btn .anticon-notification').click();
    await notification.click();

    // Duyệt đơn yêu cầu
    await page.click('button:has-text("Duyệt đơn")');

    await page.fill('#remarks', 'Oke nha em');

    // Mở dropdown
    await page.locator('.ant-select-selector .ant-select-selection-item').and(page.getByTitle("Bản nháp")).click();

    // Chọn mục "Đã phê duyệt"
    const approved = page.locator('.ant-select-item-option-content:has-text("Đã phê duyệt")');

    // Cuộn xuống nếu cần thiết và click vào mục này
    while (await approved.isHidden()) {
        await page.keyboard.press('ArrowDown');
    }

    // Click chọn "Đã phê duyệt"
    await approved.click();

    // Nhấp vào nút "Đồng ý" trong modal phê duyệt yêu cầu
    await page.click('button:has-text("Đồng ý")');

    // Nhấp vào nút "OK" trong modal xác nhận
    const okButton = page.locator('.ant-modal-content button.ant-btn-primary:has-text("OK")');
    await okButton.click();

    await login(page, "Alex Morgan");

    // Mở dropdown thông báo (biểu tượng notification)
    await page.locator('.ant-btn .anticon-notification').click();

    // Chọn thông báo có chứa văn bản "Thông báo duyệt đơn yêu cầu ID: 25"
    await notification.click();

});

//Test trưởng phòng và quản lý có xem được lịch sử yêu cầu điều chuyển không
test('Test trưởng phòng và quản lý có xem được lịch sử yêu cầu điều chuyển không', async ({ page }) => {
    await page.goto('http://localhost:3000/transfers/requests'); // Thay đổi URL này thành URL đầy đủ của trang tạo yêu cầu điều chuyển

    // Đăng nhập
    await login(page, "Jerome Mann");

    // Mở dropdown
    await viewTransferRequestDetail(page, 1);

    //mở nút lịch sử
    const isOpen = page.click('button:has-text("Hiển thị lịch sử")');
    await isOpen;
});