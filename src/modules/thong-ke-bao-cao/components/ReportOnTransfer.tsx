import React, { useEffect, useState } from "react";
import { Card, Statistic, Row, Col, Typography } from "antd";
import { Pie } from 'recharts';
import PieChartCard from './Card.PieChart'; // Import PieChartCard component
import StatisticCard from './Card.StatisticCard'; // Import StatisticCard component
//import services
import { getAcceptanceRate, getAverageProcessingTime, getRejectionRate, getApprovedDecisions } from "../../quyet-dinh-dieu-chuyen-nhan-su/services/transfer_decision_service";
import { getApprovedRequest } from "../../dieu-huong-dieu-chuyen/services/transfers_request_services";

const { Title } = Typography;

interface ReportOnTransferProps {
    name: string;
    value: number;
}

const ReportOnTransfer: React.FC = () => {
    const [averageProcessingTime, setAverageProcessingTime] = useState<number | null>(null);
    const [totalTransferDecision, setTotalTransferDecision] = useState<number | null>(null);
    const [totalTransferRequest, setTotalTransferRequest] = useState<number | null>(null);
    const [data, setData] = useState<ReportOnTransferProps[]>([]);
    const [approvalData, setApprovalData] = useState<ReportOnTransferProps[]>([]);
    const [activeIndex1, setActiveIndex1] = useState<number | null>(null);
    const [activeIndex2, setActiveIndex2] = useState<number | null>(null);

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

    useEffect(() => {
        const fetchData = async () => {
            //lấy tỷ lệ chấp nhận
            const acceptanceRate = await getAcceptanceRate();
            //lấy tỷ lệ từ chối
            const rejectionRate = await getRejectionRate();
            //lấy thời gian xử lý trung bình
            const average = await getAverageProcessingTime();
            setAverageProcessingTime(average);
            //lấy tổng số quyết định điều chuyển
            const approved = await getApprovedDecisions();
            setTotalTransferDecision(approved.approved);
            //lấy tổng số yêu cầu điều chuyển
            const totalRequest = await getApprovedRequest();
            setTotalTransferRequest(totalRequest.approved);

            // Tính toán dữ liệu cho biểu đồ
            const otherRate = 100 - acceptanceRate - rejectionRate;
            const chartData = [
                { name: 'Chấp nhận', value: acceptanceRate },
                { name: 'Từ chối', value: rejectionRate },
                { name: 'Đang duyệt', value: otherRate }
            ].filter(item => item.value > 1e-10);
            setData(chartData);

            // Tính toán dữ liệu cho biểu đồ tỷ lệ duyệt đơn
            const approvalRate = (approved.approved / totalRequest.approved) * 100;
            const approvalChartData = [
                { name: 'Được duyệt', value: approvalRate },
                { name: 'Chưa được duyệt', value: 100 - approvalRate }
            ].filter(item => item.value > 1e-10);
            setApprovalData(approvalChartData);
        }
        fetchData();
    }, []);

    const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

    const onPieEnter1 = (_: Pie, index: number) => {
        setActiveIndex1(index);
    };

    const onPieLeave1 = () => {
        setActiveIndex1(null);
    };

    const onPieEnter2 = (_: Pie, index: number) => {
        setActiveIndex2(index);
    };

    const onPieLeave2 = () => {
        setActiveIndex2(null);
    };

    return (
        <div>
            <Title level={2}>Báo cáo hiệu quả điều chuyển chung</Title>
            <Row gutter={16}>
                <Col span={18}>
                    <PieChartCard
                        title="TỶ LỆ(%) DUYỆT ĐƠN QUYẾT ĐỊNH ĐIỀU CHUYỂN LẤY TỪ ĐƠN CHẤP NHẬN YÊU CẦU ĐIỀU CHUYỂN"
                        data={data}
                        colors={COLORS}
                        activeIndex={activeIndex1}
                        onPieEnter={onPieEnter1}
                        onPieLeave={onPieLeave1}
                        renderCustomizedLabel={renderCustomizedLabel}
                    />
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Thời gian xử lý trung bình từ khi tạo yêu cầu đến khi thực hiện quyết định"
                            value={averageProcessingTime !== null ? averageProcessingTime : 0}
                            suffix="ngày"
                        />
                    </Card>
                    <br />
                    <StatisticCard
                        title="Số đơn quyết định điều chuyển được duyệt trên số đơn yêu cầu điều chuyển"
                        value={(totalTransferDecision !== null ? totalTransferDecision : 0) + "/" +
                            (totalTransferRequest !== null ? totalTransferRequest : 0)}
                        valueStyle={{ color: '#cf1322' }}
                        suffix="Đơn"
                    />
                </Col>
            </Row>
        </div>
    );
};

export default ReportOnTransfer;