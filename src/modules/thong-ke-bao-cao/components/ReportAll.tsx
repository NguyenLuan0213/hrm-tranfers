import React, { useEffect, useState } from "react";
import { Card, Statistic, Row, Col, Typography } from "antd";
//import services
import { getAcceptanceRate, getAverageProcessingTime, getRejectionRate } from "../../quyet-dinh-dieu-chuyen-nhan-su/services/transfer_decision_service";

const { Title } = Typography;

const ReportAll: React.FC = () => {
    const [averageProcessingTime, setAverageProcessingTime] = useState<number | null>(null);
    const [approvalRate, setApprovalRate] = useState<number | null>(null);
    const [rejectionRate, setRejectionRate] = useState<number | null>(null);

    //Lấy tỷ lệ yêu cầu được phê duyệt và bị từ chối
    useEffect(() => {
        const fetchData = async () => {
            const acceptanceRate = await getAcceptanceRate();
            const rejectionRate = await getRejectionRate();
            const average = await getAverageProcessingTime();
            setApprovalRate(acceptanceRate);
            setRejectionRate(rejectionRate);
            setAverageProcessingTime(average);
        }
        fetchData();
    }, []);

    return (
        <div>
            <Title level={2}>Báo cáo hiệu quả điều chuyển chung</Title>
            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Thời gian xử lý trung bình từ khi tạo yêu cầu đến khi thực hiện quyết định"
                            value={averageProcessingTime !== null ? averageProcessingTime : 0}
                            suffix="ngày"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tỷ lệ chấp nhận quyết định điều chuyển từ yêu cầu điều chuyển được phê duyệt"
                            value={approvalRate !== null ? approvalRate.toFixed(2) : 0}
                            valueStyle={{ color: '#3f8600' }}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tỷ lệ từ chối quyết định điều chuyển từ yêu cầu điều chuyển được phê duyệt"
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

export default ReportAll;