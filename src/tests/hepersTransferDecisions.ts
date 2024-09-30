import { Page, expect } from "@playwright/test";

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
    const latestMessage = message[message.length - 1];
    console.log('latestMessage', latestMessage);
    await expect(latestMessage).toContain(textMessage);
}