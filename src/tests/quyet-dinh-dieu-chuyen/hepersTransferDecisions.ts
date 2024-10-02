import { Page, expect } from "@playwright/test";

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

export const waitForMinutes = async (page: Page) => {
    await page.waitForTimeout(3000); // Chờ để trang tải
}

export const viewTransferDecisionDetail = async (page: Page, dataRowKey: number) => {
    const chiTietButton = page.locator(`table tbody tr[data-row-key="${dataRowKey}"] button:has-text("Chi tiết")`);
    await chiTietButton.click();
}

export const checkMassage = async (page: Page, textMessage: string) => {
    const message = await page.locator('.ant-message-custom-content').allTextContents();
    // Kiểm tra thông báo cuối cùng (thông báo mới nhất)
    if (message.length === 0) {
        return expect(message).toContain(textMessage);

    }
    const latestMessage = message[message.length - 1];
    expect(latestMessage).toContain(textMessage);
}

export const notificationClick = async (page: Page) => {
    await page.locator('.ant-btn .anticon-notification').click();
    const notification = page.locator('.ant-dropdown-menu-item:has-text("Thông báo duyệt đơn quyết định ID")');
    await notification.click();
}

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


