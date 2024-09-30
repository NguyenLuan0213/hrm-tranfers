import { Page, expect } from "@playwright/test";

export const login = async (page: Page, name: string) => {
    await page.click('div.ant-select-selector');
    let option = page.locator(`.ant-select-item-option-content:has-text('${name}')`);
    while (await option.isHidden()) {
        await page.keyboard.press('ArrowDown');
    }
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