import { Page } from 'playwright';
import { expect } from '@playwright/test'; // Import expect từ Playwright Test
import { error } from 'console';

export const login = async (page: Page, role: string, select: string) => {
    // Mở dropdown
    await page.click('div.ant-select-selector');

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
            break;
        }
    }

    // Kiểm tra nếu tìm thấy phần tử
    const isOptionVisible = await option.isVisible();
    // Nếu không tìm thấy người dùng, log ra thông báo và dừng test
    if (!isOptionVisible) {
        console.log(`Không tìm thấy người dùng có role: '${role}' và select: '${select}'`);

        // Dừng test lại
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
        error('Không thể xem chi tiết yêu cầu điều chuyển');
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
