import { Page, expect } from "@playwright/test";

// Hàm đăng nhập
export const login = async (page: Page, role?: string, select?: string, name?: string) => {
    // Mở dropdown
    await page.click('div.ant-select-selector');
    await page.waitForSelector('.ant-select-item-option-content');

    // Cuộn lên đầu danh sách
    await page.keyboard.press('Home');

    let option;
    // Tìm phần tử mong muốn
    if (name == null) {
        option = page.locator(`.ant-select-item-option-content:has-text('${role}')`).and(page.locator(`.ant-select-item-option-content:has-text('${select}')`)).first();
    }
    else {
        option = page.locator(`.ant-select-item-option-content:has-text('${name}')`);
    }

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

// Hàm chờ trang tải
export const waitForMinutes = async (page: Page) => {
    await page.waitForTimeout(3000); // Chờ để trang tải
}

//Hàm xem chi tiết quyết định điều chuyển theo data-row-key
export const viewTransferDecisionDetail = async (page: Page, dataRowKey: number) => {
    const chiTietButton = page.locator(`table tbody tr[data-row-key="${dataRowKey}"] button:has-text("Chi tiết")`);
    await chiTietButton.click();
}

// Hàm kiểm tra thông báo
export const checkMessage = async (page: Page, textMessage: string) => {
    const message = await page.locator('.ant-message-custom-content').allTextContents();
    // Kiểm tra thông báo cuối cùng (thông báo mới nhất)
    if (message.length === 0) {
        return expect(message).toContain(textMessage);

    }
    const latestMessage = message[message.length - 1];
    expect(latestMessage).toContain(textMessage);
}

//hàm click vào thông báo
export const notificationClick = async (page: Page) => {
    await page.locator('.ant-btn .anticon-notification').click();
    const notification = page.locator('.ant-dropdown-menu-item:has-text("Thông báo duyệt đơn quyết định ID")');
    await notification.click();
}

// Hàm chuyển đến trang cuối cùng
export const selectOptionLastItem = async (page: Page) => {
    // Mở selector trong modal
    await page.locator('.ant-modal-content .ant-select-selector').click();

    // Lấy số lượng option có thể chọn
    const options = page.locator('.ant-select-item-option-content');

    // Lấy tổng số option
    const optionCount = await options.count();

    // Nếu có option, cuộn qua tất cả option
    if (optionCount > 0) {
        for (let i = 0; i < optionCount; i++) {
            // Sử dụng phím 'ArrowDown' để cuộn qua từng option
            await page.keyboard.press('ArrowDown');
        }

        // Lấy option cuối cùng sau khi đã cuộn
        const lastOption = options.nth(optionCount - 1);

        // Kiểm tra nếu option cuối cùng có sẵn để chọn
        if (await lastOption.isVisible()) {
            await lastOption.click();
        } else {
            expect(await lastOption.isVisible()).toBe(true);
        }
    } else {
        expect(optionCount).toBeGreaterThan(0);
    }
};

//xem chi tiết quyết định sau khi tạo
export const viewDetailAfterCreate = async (page: Page) => {
    const lastPageButton = page.locator('li.ant-pagination-item').last();
    await lastPageButton.click();

    // Nhấp vào nút "Chi tiết" của yêu cầu mới tạo
    const chiTietButton = page.locator('table tbody tr:last-child button:has-text("Chi tiết")');
    await chiTietButton.click();
}

// Hàm chuyển đến trang cuối cùng
export const goToLastPage = async (page: Page) => {
    const lastPageButton = page.locator('li.ant-pagination-item').last();
    await lastPageButton.click();
};

//hàm lấy data-row-key theo status
export async function getRowKeyByStatus(page: Page, status: string): Promise<string | null> {
    const rows = await page.$$('.ant-table-row');
    for (let row of rows) {
        const statusElement = await row.$('.ant-tag');
        const statusText = await statusElement?.textContent();
        if (statusText?.trim() === status) {
            return await row.getAttribute('data-row-key');
        }
    }
    return null;
}