import React, { useState } from "react";
import { Button, Card, Flex, Typography } from "antd";
import dayjs from "dayjs";
//import service
import { HistoryTransferDecisionApproval } from "../services/transfer-decision-approval-service";
//import helpers
import { getStatusTagApprove } from "../helpers/GetTagStatusTransferDecision";

const { Text } = Typography;

interface CardHistoryTransfersDecisionApprovalProps {
    historyTransfersDecisionApproval: HistoryTransferDecisionApproval[] | [];
    employee: ({ id: number, name: string })[];
}

const CardHistoryTransfersDecisionApproval: React.FC<CardHistoryTransfersDecisionApprovalProps> = ({ historyTransfersDecisionApproval, employee }) => {
    const [loading, setLoading] = useState<boolean>(true);

    return (
        <Flex gap="middle" align="start" vertical>
            <Button onClick={() => setLoading(!loading)}>
                {loading ? 'Hiển thị lịch sử' : 'Ẩn lịch sử'}
            </Button>
            <Card
                loading={loading}
                style={{ width: '100%', maxHeight: '75vh', overflow: 'auto' }}
                title="Lịch sử duyệt đơn điều chuyển"
                bordered={false}
            >
                {historyTransfersDecisionApproval?.length === 0 && <Text>Chưa có lịch sử duyệt</Text>}
                {historyTransfersDecisionApproval?.map((approval) => (
                    <div key={approval.primaryId}>
                        <Text strong>ID đơn đuyệt:</Text> <Text>{approval.id}</Text>
                        <br />
                        <Text strong>Người duyệt:</Text> <Text>{employee.find((emp) => emp.id.toString() === approval?.approverId?.toString())?.name || ''}</Text>
                        <br />
                        <Text strong>Trạng thái duyệt:</Text> <Text>{getStatusTagApprove(approval.approvalsAction)}</Text>
                        <br />
                        <Text strong>Nhận xét:</Text> <Text>{approval.remarks}</Text>
                        <br />
                        <Text strong>Ngày duyệt:</Text> <Text>{approval.approvalDate ? dayjs(approval.approvalDate).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text>
                        <br />
                        <div style={{ marginTop: 10, borderBottom: '1px solid #080a0a' }} />
                    </div>
                ))}

            </Card>
        </Flex>
    )
}

export default CardHistoryTransfersDecisionApproval;