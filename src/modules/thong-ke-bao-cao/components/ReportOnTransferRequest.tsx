import React, { useEffect, useState } from "react";
import { Row, Col, Typography } from "antd";
//import components
import CardPieChart from './Card.PieChart'; // Import StatisticCard component
import StatisticCard from './Card.StatisticCard'; // Import StatisticCard component
//import services
import { getAverageProcessingTimeByRequest, getAcceptanceRateByRequest, getRejectionRateByRequest, getLengthTransferRequest } from "../../dieu-huong-dieu-chuyen/services/transfers_request_services"; // Import service
import { Pie } from "recharts";

const { Title } = Typography;

const ReportOnTransferRequest: React.FC = () => {
    const [averageProcessingTime, setAverageProcessingTime] = useState<number | null>(null);
    const [lengthTransferRequest, setLengthTransferRequest] = useState<number | null>(null);
    const [data, setData] = useState<{ name: string, value: number }[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    //tạo dữ liệu cho biểu đồ
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: {
        cx: number;
        cy: number;
        midAngle: number;
        innerRadius: number;
        outerRadius: number;
        percent: number;
        index: number;
        name: string;
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(2)}%`}
            </text>
        );
    };

    //Lấy tỷ lệ yêu cầu được phê duyệt và bị từ chối
    useEffect(() => {
        const fetchData = async () => {
            //lấy đơn chấp nhận
            const acceptanceRate = await getAcceptanceRateByRequest();
            //lấy đơn từ chối
            const rejectionRate = await getRejectionRateByRequest();
            //lấy thời gian xử lý trung bình
            const average = await getAverageProcessingTimeByRequest();
            setAverageProcessingTime(average);
            //lấy tổng số đơn yêu cầu điều chuyển
            const length = await getLengthTransferRequest();
            setLengthTransferRequest(length);

            // Tính toán dữ liệu cho biểu đồ
            const otherRate = 100 - acceptanceRate - rejectionRate;
            const chartData = [
                { name: 'Chấp nhận', value: acceptanceRate },
                { name: 'Từ chối', value: rejectionRate },
                { name: 'Đang duyệt', value: otherRate }
            ].filter(item => item.value > 1e-10); 
            setData(chartData);
        }
        fetchData();
    }, []);

    const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

    const onPieEnter = (_: Pie, index: number) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(null);
    };

    return (
        <div>
            <Title  level={2}>Báo cáo hiệu quả điều chuyển đơn yêu cầu điều chuyển</Title>
            <Row gutter={16}>
                <Col span={18}>
                    <CardPieChart
                        title="TỶ LỆ(%) ĐƠN YÊU CẦU ĐIỀU CHUYỂN ĐƯỢC CHẤP NHẬN VÀ TỪ CHỐI "
                        data={data}
                        colors={COLORS}
                        activeIndex={activeIndex}
                        onPieEnter={onPieEnter}
                        onPieLeave={onPieLeave}
                        renderCustomizedLabel={renderCustomizedLabel}
                    />
                </Col>
                <Col span={6}>
                    <StatisticCard
                        title="Thời gian xử lý yêu cầu trung bình"
                        value={averageProcessingTime !== null ? averageProcessingTime : 0}
                        suffix="ngày"
                    />
                    <br />
                    <StatisticCard
                        title="Tổng số đơn yêu cầu điều chuyển"
                        value={lengthTransferRequest !== null ? lengthTransferRequest : 0}
                        valueStyle={{ color: '#cf1322' }}
                        suffix="Đơn"
                    />
                </Col>
            </Row>
        </div>
    );
};

export default ReportOnTransferRequest;