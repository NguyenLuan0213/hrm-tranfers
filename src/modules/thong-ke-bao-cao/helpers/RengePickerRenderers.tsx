import { DatePicker } from 'antd';
import { Dayjs } from 'dayjs';
import { disabled8DaysDate, disabled8MonthsDate, disabled8QuartersDate, disabled8YearsDate } from './DisabledWhenChoiceDate';

const { RangePicker } = DatePicker;

export const renderRangePickerTime = (pickerType: string, handleRangePickerChange: (dates: [Dayjs | null, Dayjs | null] | null) => void) => {
    switch (pickerType) {
        case 'day':
            return <RangePicker disabledDate={disabled8DaysDate} onChange={handleRangePickerChange} />;
        case 'month':
            return <RangePicker disabledDate={disabled8MonthsDate} picker="month" onChange={handleRangePickerChange} />;
        case 'quarter':
            return <RangePicker disabledDate={disabled8QuartersDate} picker="quarter" onChange={handleRangePickerChange} />;
        case 'year':
            return <RangePicker disabledDate={disabled8YearsDate} picker="year" onChange={handleRangePickerChange} />;
        default:
            return <RangePicker onChange={handleRangePickerChange} />;
    }
};

export const renderRangePickerDeparment = (pickerType: string, handleRangePickerChange: (dates: [Dayjs | null, Dayjs | null] | null) => void) => {
    switch (pickerType) {
        case 'month':
            return <RangePicker disabledDate={disabled8MonthsDate} picker="month" onChange={handleRangePickerChange} />;
        case 'quarter':
            return <RangePicker disabledDate={disabled8QuartersDate} picker="quarter" onChange={handleRangePickerChange} />;
        case 'year':
            return <RangePicker disabledDate={disabled8YearsDate} picker="year" onChange={handleRangePickerChange} />;
        default:
            return <RangePicker onChange={handleRangePickerChange} />;
    }
};

export const renderRangePickerPosition = (pickerType: string, handleRangePickerChange: (dates: [Dayjs | null, Dayjs | null] | null) => void) => {
    switch (pickerType) {
        case 'month':
            return <RangePicker disabledDate={disabled8MonthsDate} picker="month" onChange={handleRangePickerChange} />;
        case 'quarter':
            return <RangePicker disabledDate={disabled8QuartersDate} picker="quarter" onChange={handleRangePickerChange} />;
        case 'year':
            return <RangePicker disabledDate={disabled8YearsDate} picker="year" onChange={handleRangePickerChange} />;
        default:
            return <RangePicker onChange={handleRangePickerChange} />;
    }
};

export const renderRangePickerEffective = (pickerType: string, handleRangePickerChange: (dates: [Dayjs | null, Dayjs | null] | null) => void) => {
    switch (pickerType) {
        case 'day':
            return <RangePicker disabledDate={disabled8DaysDate} onChange={handleRangePickerChange} />;
        case 'month':
            return <RangePicker disabledDate={disabled8MonthsDate} picker="month" onChange={handleRangePickerChange} />;
        case 'quarter':
            return <RangePicker disabledDate={disabled8QuartersDate} picker="quarter" onChange={handleRangePickerChange} />;
        case 'year':
            return <RangePicker disabledDate={disabled8YearsDate} picker="year" onChange={handleRangePickerChange} />;
        default:
            return <RangePicker onChange={handleRangePickerChange} />;
    }
};