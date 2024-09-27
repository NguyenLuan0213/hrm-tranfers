import React, { useEffect } from "react";
import { Card, Col, Row, Select, Statistic, Typography } from "antd";
import { FormOutlined } from "@ant-design/icons";
import { BarChart, CartesianGrid, Legend, Bar, ResponsiveContainer, XAxis, YAxis, Rectangle, Tooltip } from "recharts";
import { TransferRequestStatus } from "../../dieu-huong-dieu-chuyen/data/transfer-request";
import { getRequestStatisticsStatus, getLengthTransferRequest } from "../../dieu-huong-dieu-chuyen/services/transfers-request-services"
import { getLengthTransfersDecisions, getDecisionsStatus } from "../../quyet-dinh-dieu-chuyen-nhan-su/services/transfer-decision-service"
import { TransferDecisionStatus } from "../../quyet-dinh-dieu-chuyen-nhan-su/data/transfer-decision";
//import helpers
import { getRequestStatusLabel } from "../../dieu-huong-dieu-chuyen/helpers/get-request-status-label"
import { getDecisionStatusLabel } from "../../quyet-dinh-dieu-chuyen-nhan-su/helpers/get-decision-status-label"

const { Title } = Typography;
const { Option } = Select;

interface Data {
    status: string;
    count: number;
}

const StatisticsByStatus: React.FC = () => {
    const [statisticType, setStatisticType] = React.useState<string>('request');
    const [data, setData] = React.useState<Data[]>([]);
    const [lengthRequest, setLengthRequest] = React.useState<number>(0);
    const [lengthDecisions, setLengthDecisions] = React.useState<number>(0);

    // Xử lý khi thay đổi loại thống kê
    const handleStatisticTypeChange = (value: string) => {
        setData([]);
        setStatisticType(value);
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

    // hàm lấy dữ liệu thống kê
    useEffect(() => {   
        const fetchData = async () => {
            if (statisticType === 'request') {
                const data = await getRequestStatisticsStatus();
                data.forEach((item: Data) => {
                    item.status = getRequestStatusLabel(item.status as TransferRequestStatus);
                    setData(data);
                });
            }
            if (statisticType === 'approval') {
                const data = await getDecisionsStatus();
                data.forEach((item: Data) => {
                    item.status = getDecisionStatusLabel(item.status as TransferDecisionStatus);
                    setData(data);
                });
                setData(data);
            }
        };
        fetchData();
    }, [statisticType]);

    // Hàm render biểu đồ
    const renderBar = () => {
        if (statisticType === 'request') {
            return (
                <Bar dataKey="count" fill="#8884d8" name={"Tổng"} activeBar={<Rectangle fill="pink" stroke="blue" />} />
            );
        } else if (statisticType === 'approval') {
            return (
                <Bar dataKey="count" fill="#8884d8" name={"Tổng"} activeBar={<Rectangle fill="pink" stroke="blue" />} />
            );
        }
    };

    return (
        <div style={{ padding: 10 }}>
            <Title level={2}>Thống kê theo trạng thái đơn</Title>
            <Row justify="center" gutter={[16, 16]}>
                <Col span={16}>
                    <ResponsiveContainer width={800} height={400}>
                        <BarChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="status" />
                            <YAxis domain={['auto', 'dataMax + 1']} />
                            <Tooltip />
                            <Legend />
                            {renderBar()}
                        </BarChart>
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
                        <Title level={4}>Chọn loại đơn điều chuyển</Title>
                        <Select
                            defaultValue="request"
                            style={{ width: 288, marginBottom: 16 }}
                            onChange={handleStatisticTypeChange}
                        >
                            <Option value="request">Theo đơn yêu cầu</Option>
                            <Option value="approval">Theo đơn quyết định</Option>
                        </Select>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default StatisticsByStatus;