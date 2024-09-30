import React, { useState } from "react";
import { Card, Typography, Flex, Button } from "antd";
import dayjs from "dayjs";
//import service
import { ApprovalTransferRequestHistory } from "../services/transfer-request-approvals-services";
//import helpers
import { getStatusTagApprove } from "../helpers/GetTagStatusTransferRequest"

const { Text } = Typography;

interface CardApprovalHistoryTransferRequestProps {
    approvalHistoryTransferRequest: ApprovalTransferRequestHistory[] | [];
    employee: ({ id: number; name: string; })[];
}

const CardApprovalHistoryTransferRequest: React.FC<CardApprovalHistoryTransferRequestProps> = ({ approvalHistoryTransferRequest, employee }) => {
    return (
        <Flex gap="middle" align="start" vertical>
            <Card
                style={{ width: '85%', maxHeight: '75vh', overflow: 'auto' }}
                title="Lịch sử duyệt đơn điều chuyển"
            >
                {approvalHistoryTransferRequest?.length === 0 && <Text>Chưa có lịch sử duyệt</Text>}
                {approvalHistoryTransferRequest?.map((approval) => (
                    <div key={approval.primaryId}>
                        <Text strong>ID đơn đuyệt:</Text> <Text>{approval.id}</Text>
                        <br />
                        <Text strong>Người duyệt:</Text> <Text>{employee.find((emp) => emp.id === approval.approverId)?.name || ''}</Text>
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
    );
}

export default CardApprovalHistoryTransferRequest;