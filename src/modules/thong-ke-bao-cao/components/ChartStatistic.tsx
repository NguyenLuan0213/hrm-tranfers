import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Col, DatePicker, Row, Typography, Select, DatePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import {
    getStatisticalByDay,
    getStatisticalByMonth,
    getStatisticalByYear,
    getStatisticalByQuarter
} from '../../dieu-huong-dieu-chuyen/services/TransfersRequestServices';
import {
    getStatisticalDevisionsByDay,
    getStatisticalDevisionsByMonth,
    getStatisticalDevisionsByYear,
    getStatisticalDevisionsByQuarter
} from '../../dieu-huong-dieu-chuyen/modules/quyet-dinh-dieu-chuyen-nhan-su/services/TransfersDecisionsService';

const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Option } = Select;

// Dữ liệu của một điểm dữ liệu
interface DataPoint {
    period: string;
    count: number;
}

// Dữ liệu của một điểm dữ liệu kết hợp
interface CombinedDataPoint extends DataPoint {
    requestCount: number;
    decisionCount: number;
}

const ChartStatistic: React.FC = () => {
    const [pickerType, setPickerType] = useState<string>('day'); // Loại picker hiện tại (ngày, tháng, quý, năm)
    const [rangePickerValue, setRangePickerValue] = useState<Dayjs[]>([]); // Giá trị của RangePicker
    const [data, setData] = useState<CombinedDataPoint[]>([]); // Dữ liệu thống kê kết hợp
    const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();// Hàm chuyển đổi ngày tháng sang số tháng


    // Xử lý khi thay đổi loại picker
    const handlePickerChange = (value: string) => {
        setPickerType(value);
    };

    // Xử lý khi thay đổi ngày tháng
    const handleRangePickerChange = (dates: [Dayjs | null, Dayjs | null] | null, dateStrings: [string, string]) => {
        if (dates && dates[0] && dates[1]) {
            setRangePickerValue([dates[0], dates[1]]);
        } else {
            setRangePickerValue([]);
        }
    };

    // Lấy dữ liệu dựa trên loại picker và phạm vi ngày tháng
    useEffect(() => {
        const fetchData = async () => {
            if (rangePickerValue.length === 2) {
                const [start, end] = rangePickerValue;
                let requestData: DataPoint[] = [];
                let decisionData: DataPoint[] = [];

                // Gọi các hàm lấy dữ liệu thống kê dựa trên loại picker
                switch (pickerType) {
                    case 'day':
                        requestData = await getStatisticalByDay(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                        decisionData = await getStatisticalDevisionsByDay(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                        break;
                    case 'month':
                        requestData = await getStatisticalByMonth(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                        decisionData = await getStatisticalDevisionsByMonth(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                        break;
                    case 'quarter':
                        requestData = await getStatisticalByQuarter(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                        decisionData = await getStatisticalDevisionsByQuarter(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                        break;
                    case 'year':
                        requestData = await getStatisticalByYear(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                        decisionData = await getStatisticalDevisionsByYear(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                        break;
                    default:
                        break;
                }

                // Kết hợp dữ liệu thống kê requests và decisions
                const combinedData: CombinedDataPoint[] = [];

                // Hàm kết hợp dữ liệu requests và decisions
                const mergeData = (data1: DataPoint[], data2: DataPoint[]) => {
                    const dataMap: { [key: string]: CombinedDataPoint } = {};

                    // Tạo một map với key là period
                    data1.forEach(item => {
                        dataMap[item.period] = { period: item.period, count: item.count, requestCount: item.count, decisionCount: 0 };
                    });

                    // Duyệt qua dữ liệu thống kê decisions và cập nhật vào map
                    data2.forEach(item => {
                        if (dataMap[item.period]) {
                            dataMap[item.period].decisionCount = item.count;
                        } else {
                            dataMap[item.period] = { period: item.period, count: 0, requestCount: 0, decisionCount: item.count };
                        }
                    });

                    return Object.values(dataMap);
                };

                setData(mergeData(requestData, decisionData));
            }
        };
        fetchData();
    }, [rangePickerValue, pickerType]);

    // Hàm kiểm tra ngày bị disable trong 8 ngày
    const disabled8DaysDate: DatePickerProps['disabledDate'] = (current, { from, type }) => {
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

    // Hàm kiểm tra tháng bị disable trong 8 tháng
    const disabled8MonthsDate: DatePickerProps['disabledDate'] = (current, { from, type }) => {
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

    // Hàm kiểm tra quý bị disable trong 8 quý
    const disabled8QuartersDate: DatePickerProps['disabledDate'] = (current, { from, type }) => {
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

    // Hàm kiểm tra năm bị disable trong 8 năm
    const disabled8YearsDate: DatePickerProps['disabledDate'] = (current, { from }) => {
        if (from) {
            const minDate = from.add(-7, 'years');
            const maxDate = from.add(7, 'years');

            return current.year() < minDate.year() || current.year() > maxDate.year();
        }

        return false;
    };

    // Hiển thị RangePicker dựa trên loại picker
    const renderRangePicker = () => {
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

    return (
        <div style={{ padding: 10 }}>
            <Title level={2}>Thống kê</Title>
            <Row justify="center" gutter={[16, 16]}>
                <Col span={16}>
                    <ResponsiveContainer width={800} height={400}>
                        <LineChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="requestCount" stroke="#8884d8" name="Đơn yêu cầu" />
                            <Line type="monotone" dataKey="decisionCount" stroke="#82ca9d" name="Đơn quyết định" />
                        </LineChart>
                    </ResponsiveContainer>
                </Col>
                <Col span={8}>
                    <Select defaultValue="day" style={{ width: 288, marginBottom: 16 }} onChange={handlePickerChange}>
                        <Option value="day">Theo ngày</Option>
                        <Option value="month">Theo tháng</Option>
                        <Option value="quarter">Theo quý</Option>
                        <Option value="year">Theo năm</Option>
                    </Select>
                    {renderRangePicker()}
                </Col>
            </Row>
        </div>
    );
};

export default ChartStatistic;
