import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Col, DatePicker, Row, Typography, Select, DatePickerProps, Card, Statistic } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import {
    getStatisticalByDay,
    getStatisticalByMonth,
    getStatisticalByYear,
    getStatisticalByQuarter,
    getRequestDepartmentDataByMonth,
    getRequestDepartmentDataByQuarter,
    getRequestDepartmentDataByYear,
    getRequestPositionByMonth,
    getRequestPositionByQuarter,
    getRequestPositionByYear,
    getLengthTransferRequest,
} from '../../dieu-huong-dieu-chuyen/services/transfers_request_services';
import {
    getStatisticalDecisionsByDay,
    getStatisticalDecisionsByMonth,
    getStatisticalDecisionsByYear,
    getStatisticalDecisionsByQuarter,
    getLengthTransfersDecisions,
    getEffectiveDecisionsByDay,
    getEffectiveDecisionsByMonth,
    getEffectiveDecisionsByYear,
    getEffectiveDecisionsByQuarter
} from '../../quyet-dinh-dieu-chuyen-nhan-su/services/transfer_decision_service';
import { getDepartment } from '../../phong-ban/services/department_services'
import { FormOutlined } from '@ant-design/icons';

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

// Dữ liệu thống kê biểu đồ department
interface dataDepartmentPoint {
    period: string;
    countFrom: number;
    countTo: number;
}

interface dataPositionPoint {
    period: string;
    EmployeeToManager: number;
    ManagerToEmployee: number;
    EmployeeToEmployee: number;
    ManagerToManager: number;
}

const ChartStatistic: React.FC = () => {
    const [pickerType, setPickerType] = useState<string>(''); // Loại picker hiện tại (ngày, tháng, quý, năm)
    const [rangePickerValue, setRangePickerValue] = useState<Dayjs[]>([]); // Giá trị của RangePicker
    const [data, setData] = useState<any[]>([]); // Dữ liệu thống kê kết hợp
    const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();// Hàm chuyển đổi ngày tháng sang số tháng
    const [statisticType, setStatisticType] = useState<string>('approved'); // Loại thống kê hiện tại
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all'); // Phòng ban được chọn
    const [departments, setDepartments] = useState<any[]>([]); // Danh sách phòng ban
    const [lengthRequest, setLengthRequest] = useState<number>(0); // Tổng số đơn yêu cầu
    const [lengthDecisions, setLengthDecisions] = useState<number>(0); // Tổng số đơn quyết định

    // Xử lý khi thay đổi loại picker
    const handlePickerChange = (value: string) => {
        setPickerType(value);
    };

    // Xử lý khi thay đổi ngày tháng
    const handleRangePickerChange = (dates: [Dayjs | null, Dayjs | null] | null, dateStrings: [string, string]) => {
        if (dates && dates[0] && dates[1]) {
            let [start, end] = dates;
            if (pickerType === 'month') {
                start = start.startOf('month');
                end = end.endOf('month');
            }
            setRangePickerValue([start, end]);
        } else {
            setRangePickerValue([]);
        }
    };

    // Xử lý khi thay đổi phòng ban
    const handleDepartmentChange = (value: string) => {
        setSelectedDepartment(value);
    };

    // Lấy tổng số đơn
    useEffect(() => {
        const getLength = async () => {
            // Gọi hàm lấy tổng số đơn yêu cầu
            const data = await getLengthTransferRequest();
            setLengthRequest(data);
            //Gọi hàm lấy tổng số đơn quyết định
            const data1 = await getLengthTransfersDecisions();
            setLengthDecisions(data1);
        }
        getLength();
    }, []);

    // Lấy dữ liệu dựa trên loại picker và phạm vi ngày tháng
    useEffect(() => {
        const fetchData = async () => {
            // Nếu loại thống kê là theo số lượng đơn
            if (statisticType === 'approved') {
                if (rangePickerValue.length === 2) {
                    const [start, end] = rangePickerValue;
                    if (start && end) {
                        let requestData: DataPoint[] = [];
                        let decisionData: DataPoint[] = [];
                        // Gọi các hàm lấy dữ liệu thống kê dựa trên loại picker
                        switch (pickerType) {
                            case 'day':
                                requestData = await getStatisticalByDay(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                                decisionData = await getStatisticalDecisionsByDay(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                                break;
                            case 'month':
                                requestData = await getStatisticalByMonth(start.format('YYYY-MM'), end.format('YYYY-MM'));
                                decisionData = await getStatisticalDecisionsByMonth(start.format('YYYY-MM'), end.format('YYYY-MM'));
                                break;
                            case 'quarter':
                                requestData = await getStatisticalByQuarter(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                                decisionData = await getStatisticalDecisionsByQuarter(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                                break;
                            case 'year':
                                requestData = await getStatisticalByYear(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                                decisionData = await getStatisticalDecisionsByYear(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                                break;
                            default:
                                break;
                        }

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
                }
            }
            // Nếu loại thống kê là theo phòng ban
            if (statisticType === "department") { // Nếu chọn phòng ban
                if (rangePickerValue.length === 2) {
                    const [start, end] = rangePickerValue;
                    if (start && end) {
                        let data: dataDepartmentPoint[] = [];

                        // Gọi các hàm lấy dữ liệu thống kê dựa trên loại picker
                        switch (pickerType) {
                            case 'month':
                                data = await getRequestDepartmentDataByMonth(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), selectedDepartment);
                                break;
                            case 'quarter':
                                data = await getRequestDepartmentDataByQuarter(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), selectedDepartment);
                                break;
                            case 'year':
                                data = await getRequestDepartmentDataByYear(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), selectedDepartment);
                                break;
                            default:
                                break;
                        }

                        // Xử lý dữ liệu thống kê phòng ban
                        const combinedData = data.map(item => ({
                            period: item.period,
                            countFrom: item.countFrom,
                            countTo: item.countTo
                        }));
                        setData(combinedData);
                    }
                }
            }
            // Nếu loại thống kê là theo vị trí
            if (statisticType === "position") { // Nếu chọn vị trí
                if (rangePickerValue.length === 2) {
                    const [start, end] = rangePickerValue;
                    if (start && end) {
                        let data: dataPositionPoint[] = [];

                        // Gọi các hàm lấy dữ liệu thống kê dựa trên loại picker
                        switch (pickerType) {
                            case 'month':
                                data = await getRequestPositionByMonth(start.format('YYYY-MM'), end.format('YYYY-MM'));
                                break;
                            case 'quarter':
                                data = await getRequestPositionByQuarter(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                                break;
                            case 'year':
                                data = await getRequestPositionByYear(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                                break;
                            default:
                                break;
                        }

                        // Xử lý dữ liệu thống kê phòng ban
                        const combinedData = data.map(item => ({
                            period: item.period,
                            employeeToManager: item.EmployeeToManager,
                            managerToEmployee: item.ManagerToEmployee,
                            employeeToEmployee: item.EmployeeToEmployee,
                            managerToManager: item.ManagerToManager
                        }));
                        setData(combinedData);
                    }
                }
            }
            // Nếu loại thống kê là theo ngày thực hiện quyết định điều chuyển
            if (statisticType === "effective") {
                if (rangePickerValue.length === 2) {
                    const [start, end] = rangePickerValue;
                    if (start && end) {
                        let data: DataPoint[] = [];
                        // Gọi các hàm lấy dữ liệu thống kê dựa trên loại picker
                        switch (pickerType) {
                            case 'day':
                                data = await getEffectiveDecisionsByDay(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                                break;
                            case 'month':
                                data = await getEffectiveDecisionsByMonth(start.format('YYYY-MM'), end.format('YYYY-MM'));
                                break;
                            case 'quarter':
                                data = await getEffectiveDecisionsByQuarter(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                                break;
                            case 'year':
                                data = await getEffectiveDecisionsByYear(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                                break;
                            default:
                                break;
                        }
                        setData(data);
                    }
                }
            }

        };
        fetchData();
    }, [rangePickerValue, pickerType, selectedDepartment]);

    // Hàm kiểm tra ngày bị disable không chọn quá 8 ngày
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

    // Hàm kiểm tra tháng bị disable không chọn quá 8 tháng
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

    // Hàm kiểm tra quý bị disable không chọn quá 8 quý
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

    // Hàm kiểm tra năm bị disable không chọn quá 8 năm
    const disabled8YearsDate: DatePickerProps['disabledDate'] = (current, { from }) => {
        if (from) {
            const minDate = from.add(-7, 'years');
            const maxDate = from.add(7, 'years');

            return current.year() < minDate.year() || current.year() > maxDate.year();
        }

        return false;
    };

    // Hiển thị RangePicker dựa trên loại picker
    const renderRangePickerTime = () => {
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

    // Xử lý khi thay đổi loại thống kê
    const handleStatisticTypeChange = (value: string) => {
        setRangePickerValue([]);
        setData([]);
        setPickerType('');
        setStatisticType(value);
    };

    // Lấy danh sách department
    useEffect(() => {
        const fetchDepartments = async () => {
            const departments = await getDepartment();
            setDepartments(departments);
        }
        fetchDepartments();
    }, []);

    // Hiển thị RangePicker dựa trên loại picker
    const renderRangePickerDeparment = () => {
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

    // Hiển thị RangePicker dựa trên loại picker
    const renderRangePickerPosition = () => {
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

    // Hiển thị RangePicker dựa trên loại picker
    const renderRangePickerEffective = () => {
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


    // Hàm xác định các dòng dữ liệu cần hiển thị trên biểu đồ
    const renderLines = () => {
        if (statisticType === 'approved') {
            return (
                <>
                    <Line type="monotone" dataKey="requestCount" stroke="#8884d8" name="Số đơn yêu cầu" />
                    <Line type="monotone" dataKey="decisionCount" stroke="#82ca9d" name="Số đơn quyết định" />
                </>
            );
        } else if (statisticType === 'department') {
            return (
                <>
                    <Line type="monotone" dataKey="countFrom" stroke="#8884d8" name="Phòng ban chuyển đến" />
                    <Line type="monotone" dataKey="countTo" stroke="#82ca9d" name="Phòng ban chuyển đi" />
                </>
            );
        } else if (statisticType === 'position') {
            return (
                <>
                    <Line type="monotone" dataKey="employeeToManager" stroke="#8884d8" name="Nhân viên chuyển đến quản lý" />
                    <Line type="monotone" dataKey="managerToEmployee" stroke="#82ca9d" name="Quản lý chuyển đến nhân viên" />
                    <Line type="monotone" dataKey="employeeToEmployee" stroke="#c7c924" name="Nhân viên chuyển đến nhân viên" />
                    <Line type="monotone" dataKey="managerToManager" stroke="#c424c9" name="Quản lý chuyển đến quản lý" />
                </>
            );
        } else if (statisticType === 'effective') {
            return (
                <>
                    <Line type="monotone" dataKey="count" stroke="#8884d8" name="Số lượng quyết định điều chuyển có hiệu lực" />
                </>
            );
        }
        // Thêm các điều kiện khác nếu cần
        return null;
    };

    return (
        <div style={{ padding: 10 }}>
            <Title level={2}>Thống kê theo thời gian</Title>
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
                            <YAxis domain={['auto', 'dataMax + 1']} />
                            <Tooltip />
                            <Legend />
                            {renderLines()}
                        </LineChart>
                    </ResponsiveContainer>
                </Col>
                <Col span={8}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card bordered={false} style={{ width: "100%" }}>
                                <Statistic
                                    title="Tổng số đơn yêu cầu điều chuyển"
                                    value={lengthRequest}
                                    valueStyle={{ color: '#3f8600' }}
                                    prefix={<FormOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card bordered={false} style={{ width: "100%" }}>
                                <Statistic
                                    title="Tổng số đơn quyết định điều chuyển"
                                    value={lengthDecisions}
                                    valueStyle={{ color: '#3f8600' }}
                                    prefix={<FormOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>
                    <div style={{ margin: 10 }}>
                        <Title level={4}>Chọn Kiểu thống kê</Title>
                        <Select
                            defaultValue="approved"
                            style={{ width: 288, marginBottom: 16 }}
                            onChange={handleStatisticTypeChange}
                        >
                            <Option value="approved">Theo số lượng đơn</Option>
                            <Option value="department">Theo phòng ban</Option>
                            <Option value="position">Theo vị trí</Option>
                            <Option value="effective">Theo ngày thực hiện quyết định điều chuyển</Option>
                        </Select>
                        {statisticType === 'approved' && (
                            <>
                                <Select
                                    placeholder="Chọn loại thống kê ngày tháng"
                                    style={{ width: 288, marginBottom: 16 }}
                                    onChange={handlePickerChange}
                                >
                                    <Option value="day">Theo ngày</Option>
                                    <Option value="month">Theo tháng</Option>
                                    <Option value="quarter">Theo quý</Option>
                                    <Option value="year">Theo năm</Option>
                                </Select>
                                {renderRangePickerTime()}
                            </>
                        )}
                        {statisticType === 'department' && (
                            <>
                                <Select
                                    placeholder="Chọn phòng ban"
                                    style={{ width: 288, marginBottom: 16 }}
                                    onChange={handleDepartmentChange}
                                >
                                    {departments.map(department => (
                                        <Option key={department.id} value={department.id}>
                                            {department.name} - Id: {department.id}
                                        </Option>
                                    ))}
                                </Select>
                                <Select
                                    placeholder="Chọn loại thống kê ngày tháng"
                                    style={{ width: 288, marginBottom: 16 }}
                                    onChange={handlePickerChange}
                                >
                                    <Option value="month">Theo tháng</Option>
                                    <Option value="quarter">Theo quý</Option>
                                    <Option value="year">Theo năm</Option>
                                </Select>
                                {renderRangePickerDeparment()}
                            </>
                        )}
                        {statisticType === 'position' && (
                            <>
                                <Select
                                    placeholder="Chọn loại thống kê ngày tháng"
                                    style={{ width: 288, marginBottom: 16 }}
                                    onChange={handlePickerChange}
                                >
                                    <Option value="month">Theo tháng</Option>
                                    <Option value="quarter">Theo quý</Option>
                                    <Option value="year">Theo năm</Option>
                                </Select>
                                {renderRangePickerPosition()}
                            </>
                        )}
                        {statisticType === 'effective' && (
                            <>
                                <Select
                                    placeholder="Chọn loại thống kê ngày tháng"
                                    style={{ width: 288, marginBottom: 16 }}
                                    onChange={handlePickerChange}
                                >
                                    <Option value="day">Theo ngày</Option>
                                    <Option value="month">Theo tháng</Option>
                                    <Option value="quarter">Theo quý</Option>
                                    <Option value="year">Theo năm</Option>
                                </Select>
                                {renderRangePickerEffective()}
                            </>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ChartStatistic;