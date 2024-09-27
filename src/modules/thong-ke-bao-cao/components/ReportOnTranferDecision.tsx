import React, { useEffect, useState } from "react";
import { Card, Statistic, Row, Col, Typography } from "antd";
import { Pie } from "recharts";
//import components
import CardPieChart from './Card.PieChart';
import StatisticCard from './Card.StatisticCard';
//import services
import {
    getAcceptanceRateByDecision,
    getAverageProcessingTimeByDecision,
    getRejectionRateByDecision,
    getLengthTransfersDecisions
} from "../../quyet-dinh-dieu-chuyen-nhan-su/services/transfer-decision-service";

const { Title } = Typography;

const ReportOnTransferDecision: React.FC = () => {
    const [averageProcessingTime, setAverageProcessingTime] = useState<number | null>(null);
    const [lengthTransferDecision, setLengthTransferDecision] = useState<number | null>(null);

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
            const acceptanceRate = await getAcceptanceRateByDecision();
            //lấy đơn từ chối
            const rejectionRate = await getRejectionRateByDecision();
            //lấy thời gian xử lý trung bình
            const average = await getAverageProcessingTimeByDecision();
            setAverageProcessingTime(average);
            //lấy tổng số đơn yêu cầu điều chuyển
            const length = await getLengthTransfersDecisions();
            setLengthTransferDecision(length);

            // Tính toán dữ liệu cho biểu đồ
            const otherRate = 100 - acceptanceRate - rejectionRate;
            const chartData = [
                { name: 'Chấp nhận', value: acceptanceRate },
                { name: 'Từ chối', value: rejectionRate },
                { name: 'Đang duyệt', value: otherRate || 0 }
            ].filter(item => item.value > 0);
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
            <Title level={2}>Báo cáo hiệu quả điều chuyển đơn quyết định điều chuyển</Title>
            <Row gutter={16}>
                <Col span={18}>
                    <CardPieChart
                        title="TỶ LỆ(%) QUYẾT ĐỊNH ĐIỀU CHUYỂN ĐƯỢC CHẤP NHẬN VÀ BỊ TỪ CHỐI"
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
                        title="Thời gian xử lý quyết định trung bình"
                        value={averageProcessingTime !== null ? averageProcessingTime : 0}
                        suffix="ngày"
                    />
                    <br />
                    <StatisticCard
                        title="Tổng số đơn quyết định điều chuyển"
                        value={lengthTransferDecision !== null ? lengthTransferDecision : 0}
                        valueStyle={{ color: '#cf1322' }}
                        suffix="Đơn"
                    />
                </Col>
            </Row>
        </div>
    );
};

export default ReportOnTransferDecision;