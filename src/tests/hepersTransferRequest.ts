import { Page } from 'playwright';

export const login = async (page: Page, name: string) => {
    // Mở dropdown
    await page.click('div.ant-select-selector');

    // Cuộn xuống để tìm phần tử mong muốn
    let option = page.locator(`.ant-select-item-option-content:has-text('${name}')`);

    // Kiểm tra nếu element không hiển thị thì dùng phím 'ArrowDown' để cuộn
    while (await option.isHidden()) {
        await page.keyboard.press('ArrowDown');
    }

    // Khi đã hiển thị thì thực hiện click để chọn
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
    }
    else {
        throw new Error("Trưởng bộ phận không thể xem chi tiết yêu cầu điều chuyển");
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
