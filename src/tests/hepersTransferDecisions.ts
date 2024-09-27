import { Page } from "@playwright/test";

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

