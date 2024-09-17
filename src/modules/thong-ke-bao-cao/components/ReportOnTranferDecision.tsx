import React, { useEffect, useState } from "react";
import { Card, Statistic, Row, Col, Typography } from "antd";
//import services
import {
    getAcceptanceRateByDecision,
    getAverageProcessingTimeByDecision,
    getRejectionRateByDecision,
    getLengthTransfersDecisions
} from "../../quyet-dinh-dieu-chuyen-nhan-su/services/transfer_decision_service";

const { Title } = Typography;

const ReportOnTransferDecision: React.FC = () => {
    const [averageProcessingTime, setAverageProcessingTime] = useState<number | null>(null);
    const [approvalRate, setApprovalRate] = useState<number | null>(null);
    const [rejectionRate, setRejectionRate] = useState<number | null>(null);
    const [lengthTransferDecision, setLengthTransferDecision] = useState<number | null>(null);

    //Lấy tỷ lệ yêu cầu được phê duyệt và bị từ chối
    useEffect(() => {
        const fetchData = async () => {
            //lấy đơn chấp nhận
            const acceptanceRate = await getAcceptanceRateByDecision();
            setApprovalRate(acceptanceRate);
            //lấy đơn từ chối
            const rejectionRate = await getRejectionRateByDecision();
            setRejectionRate(rejectionRate);
            //lấy thời gian xử lý trung bình
            const average = await getAverageProcessingTimeByDecision();
            setAverageProcessingTime(average);
            //lấy tổng số đơn yêu cầu điều chuyển
            const length = await getLengthTransfersDecisions();
            setLengthTransferDecision(length);
        }
        fetchData();
    }, []);

    return (
        <div>
            <Title level={2}>Báo cáo hiệu quả điều chuyển đơn quyết định điều chuyển</Title>
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Thời gian xử lý quyết định trung bình"
                            value={averageProcessingTime !== null ? averageProcessingTime : 0}
                            suffix="ngày"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tỷ lệ quyết định được phê duyệt"
                            value={approvalRate !== null ? approvalRate.toFixed(2) : 0}
                            valueStyle={{ color: '#3f8600' }}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tỷ lệ quyết định bị từ chối"
                            value={rejectionRate !== null ? rejectionRate.toFixed(2) : 0}
                            valueStyle={{ color: '#cf1322' }}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng số đơn quyết định điều chuyển"
                            value={lengthTransferDecision !== null ? lengthTransferDecision : 0}
                            valueStyle={{ color: '#cf1322' }}
                            suffix="Đơn"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ReportOnTransferDecision;