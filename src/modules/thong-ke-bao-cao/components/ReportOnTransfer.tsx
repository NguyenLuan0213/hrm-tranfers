import React, { useEffect, useState } from "react";
import { Card, Statistic, Row, Col, Typography } from "antd";
//import services
import { getAcceptanceRate, getAverageProcessingTime, getRejectionRate, getApprovedDecisions } from "../../quyet-dinh-dieu-chuyen-nhan-su/services/transfer_decision_service";
import { getApprovedRequest } from "../../dieu-huong-dieu-chuyen/services/transfers_request_services";

const { Title } = Typography;

const ReportOnTransfer: React.FC = () => {
    const [averageProcessingTime, setAverageProcessingTime] = useState<number | null>(null);
    const [approvalRate, setApprovalRate] = useState<number | null>(null);
    const [rejectionRate, setRejectionRate] = useState<number | null>(null);
    const [totalTransferDecision, setTotalTransferDecision] = useState<number | null>(null);
    const [totalTransferRequest, setTotalTransferRequest] = useState<number | null>(null);


    //lấy dữ liệu báo cáo
    useEffect(() => {
        const fetchData = async () => {
            //lấy tỷ lệ chấp nhận
            const acceptanceRate = await getAcceptanceRate();
            setApprovalRate(acceptanceRate);
            //lấy tỷ lệ từ chối
            const rejectionRate = await getRejectionRate();
            setRejectionRate(rejectionRate);
            //lấy thời gian xử lý trung bình
            const average = await getAverageProcessingTime();
            setAverageProcessingTime(average);
            //lấy tổng số quyết định điều chuyển
            const approved = await getApprovedDecisions();
            setTotalTransferDecision(approved.approved);
            //lấy tổng số yêu cầu điều chuyển
            const totalRequest = await getApprovedRequest();
            setTotalTransferRequest(totalRequest.approved);
        }
        fetchData();
    }, []);

    return (
        <div>
            <Title level={2}>Báo cáo hiệu quả điều chuyển chung</Title>
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Thời gian xử lý trung bình từ khi tạo yêu cầu đến khi thực hiện quyết định"
                            value={averageProcessingTime !== null ? averageProcessingTime : 0}
                            suffix="ngày"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tỷ lệ chấp nhận quyết định điều chuyển từ yêu cầu điều chuyển được phê duyệt"
                            value={approvalRate !== null ? approvalRate.toFixed(2) : 0}
                            valueStyle={{ color: '#3f8600' }}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tỷ lệ từ chối quyết định điều chuyển từ yêu cầu điều chuyển được phê duyệt"
                            value={rejectionRate !== null ? rejectionRate.toFixed(2) : 0}
                            valueStyle={{ color: '#cf1322' }}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Số đơn quyết định điều chuyển được duyệt trên số đơn yêu cầu điều chuyển"
                            value={(totalTransferDecision !== null ? totalTransferDecision : 0) + "/" + (totalTransferRequest !== null ? totalTransferRequest : 0)}
                            valueStyle={{ color: '#cf1322' }}
                            suffix="Đơn"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ReportOnTransfer;