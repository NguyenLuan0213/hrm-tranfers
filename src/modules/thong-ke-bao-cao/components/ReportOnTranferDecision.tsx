import React, { useEffect, useState } from "react";
import { Card, Statistic, Row, Col, Typography } from "antd";
//import services
import { getAcceptanceRateByDecision, getAverageProcessingTimeByDecision, getRejectionRateByDecision } from "../../quyet-dinh-dieu-chuyen-nhan-su/services/transfer_decision_service";

const { Title } = Typography;

const ReportOnTransferDecision: React.FC = () => {
    const [averageProcessingTime, setAverageProcessingTime] = useState<number | null>(null);
    const [approvalRate, setApprovalRate] = useState<number | null>(null);
    const [rejectionRate, setRejectionRate] = useState<number | null>(null);

    //Lấy tỷ lệ yêu cầu được phê duyệt và bị từ chối
    useEffect(() => {
        const fetchData = async () => {
            const acceptanceRate = await getAcceptanceRateByDecision();
            const rejectionRate = await getRejectionRateByDecision();
            const average = await getAverageProcessingTimeByDecision();
            setApprovalRate(acceptanceRate);
            setRejectionRate(rejectionRate);
            setAverageProcessingTime(average);
        }
        fetchData();
    }, []);

    return (
        <div>
            <Title level={2}>Báo cáo hiệu quả điều chuyển đơn quyết định điều chuyển</Title>
            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Thời gian xử lý quyết định trung bình"
                            value={averageProcessingTime !== null ? averageProcessingTime : 0}
                            suffix="ngày"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tỷ lệ quyết định được phê duyệt"
                            value={approvalRate !== null ? approvalRate.toFixed(2) : 0}
                            valueStyle={{ color: '#3f8600' }}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tỷ lệ quyết định bị từ chối"
                            value={rejectionRate !== null ? rejectionRate.toFixed(2) : 0}
                            valueStyle={{ color: '#cf1322' }}
                            suffix="%"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ReportOnTransferDecision;