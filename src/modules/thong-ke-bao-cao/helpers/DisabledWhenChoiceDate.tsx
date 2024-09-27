import { DatePickerProps } from "antd";
import { Dayjs } from "dayjs";

export const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();// Hàm chuyển đổi ngày tháng sang số tháng

// Hàm kiểm tra ngày bị disable không chọn quá 8 ngày
export const disabled8DaysDate: DatePickerProps['disabledDate'] = (current, { from, type }) => {
    if (from) {
        const minDate = from.add(-7, 'days');
        const maxDate = from.add(7, 'days');

        // Kiểm tra xem ngày hiện tại có nằm trong phạm vi 8 ngày không
        switch (type) {
            case 'year':
                return current.year() < minDate.year() || current.year() > maxDate.year();

            case 'month':
                return (
                    getYearMonth(current) < getYearMonth(minDate) ||
                    getYearMonth(current) > getYearMonth(maxDate)
                );

            default:
                return Math.abs(current.diff(from, 'days')) >= 8;
        }
    }

    return false;
};

// Hàm kiểm tra tháng bị disable không chọn quá 8 tháng
export const disabled8MonthsDate: DatePickerProps['disabledDate'] = (current, { from, type }) => {
    if (from) {
        const minDate = from.add(-7, 'months');
        const maxDate = from.add(7, 'months');

        switch (type) {
            case 'year':
                return current.year() < minDate.year() || current.year() > maxDate.year();

            default:
                return (
                    getYearMonth(current) < getYearMonth(minDate) ||
                    getYearMonth(current) > getYearMonth(maxDate)
                );
        }
    }

    return false;
};

// Hàm kiểm tra quý bị disable không chọn quá 8 quý
export const disabled8QuartersDate: DatePickerProps['disabledDate'] = (current, { from, type }) => {
    if (from) {
        const minDate = from.add(-7, 'quarters');
        const maxDate = from.add(7, 'quarters');

        switch (type) {
            case 'year':
                return current.year() < minDate.year() || current.year() > maxDate.year();

            default:
                return (
                    getYearMonth(current) < getYearMonth(minDate) ||
                    getYearMonth(current) > getYearMonth(maxDate)
                );
        }
    }

    return false
}

// Hàm kiểm tra năm bị disable không chọn quá 8 năm
export const disabled8YearsDate: DatePickerProps['disabledDate'] = (current, { from }) => {
    if (from) {
        const minDate = from.add(-7, 'years');
        const maxDate = from.add(7, 'years');

        return current.year() < minDate.year() || current.year() > maxDate.year();
    }

    return false;
};