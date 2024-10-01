import { Page } from 'playwright';
import { expect } from '@playwright/test'; // Import expect từ Playwright Test

export const login = async (page: Page, role: string, select: string) => {
    // Mở dropdown
    await page.click('div.ant-select-selector');
    await page.waitForSelector('.ant-select-item-option-content');

    // Cuộn lên đầu danh sách
    await page.keyboard.press('Home');

    // Tìm phần tử mong muốn
    const option = page.locator(`.ant-select-item-option-content:has-text('${role}')`).and(page.locator(`.ant-select-item-option-content:has-text('${select}')`)).first();

    // Biến đếm số lần cuộn
    let scrollCount = 0;
    const maxScrolls = 100; // Giới hạn số lần cuộn để tránh vòng lặp vô hạn

    // Kiểm tra nếu element không hiển thị thì dùng phím 'ArrowDown' để cuộn
    while (await option.isHidden()) {
        await page.keyboard.press('ArrowDown');
        scrollCount++;

        // Nếu đã cuộn hết danh sách mà vẫn không tìm thấy, ném lỗi
        if (scrollCount > maxScrolls) {
            expect(await option.isVisible()).toBe(true); // Sử dụng expect để dừng test lại khi không tìm thấy
            return;
        }
    }

    // Kiểm tra nếu tìm thấy phần tử
    const isOptionVisible = await option.isVisible();
    if (!isOptionVisible) {
        expect(isOptionVisible).toBe(true); // Sử dụng expect để dừng test lại khi không tìm thấy
        return;
    }

    // Click vào option nếu tìm thấy
    await option.click();
};

// Hàm chuyển đến trang cuối cùng
export const goToLastPage = async (page: Page) => {
    const lastPageButton = page.locator('li.ant-pagination-item').last();
    await lastPageButton.click();
};

// Hàm chờ trang xem kết quả
export const waitForMinutes = async (page: Page) => {
    await page.waitForTimeout(3000); // Chờ để trang tải
}

// Hàm xem chi tiết yêu cầu điều chuyển
export const viewTransferRequestDetail = async (page: Page, dataRowKey: number) => {
    const chiTietButton = page.locator(`table tbody tr[data-row-key="${dataRowKey}"] button:has-text("Chi tiết")`);
    const isDisabled = await chiTietButton.isDisabled();
    if (!isDisabled) {
        // Nhấp vào nút "Chi tiết"
        await chiTietButton.click();
    } else {
        expect(isDisabled).toBe(true); // Sử dụng expect để dừng test lại nếu không thể xem chi tiết
    }
}

// Hàm xem chi tiết yêu cầu điều chuyển mới tạo
export const goToDetailAfterCreate = async (page: Page) => {
    const lastPageButton = page.locator('li.ant-pagination-item').last();
    await lastPageButton.click();

    // Nhấp vào nút "Chi tiết" của yêu cầu mới tạo
    const chiTietButton = page.locator('table tbody tr:last-child button:has-text("Chi tiết")');
    await chiTietButton.click();
};

// Hàm chờ trang xem kết quả
export const checkMassage = async (page: Page, textMessage: string) => {
    // Tìm tất cả thông báo đang hiển thị
    const allMessages = await page.locator('.ant-message-custom-content').allTextContents();

    // Kiểm tra thông báo cuối cùng (thông báo mới nhất)
    const latestMessage = allMessages[allMessages.length - 1];
    expect(latestMessage).toContain(textMessage);
};

export const notificationClick = async (page: Page) => {
    await page.locator('.ant-btn .anticon-notification').click();
    const notification = page.locator('.ant-dropdown-menu-item:has-text("Thông báo duyệt đơn yêu cầu ID")');
    await notification.click();
}
