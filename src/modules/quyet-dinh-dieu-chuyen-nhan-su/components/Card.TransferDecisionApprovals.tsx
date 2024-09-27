import React from "react";
import { Card, Typography } from "antd";
import dayjs from "dayjs";
//import dữ liệu
import { TransferDecisionApproval, ApprovalsAction } from "../data/transfer-decision-approvals";
//import helpers
import { getStatusTagApprove } from "../helpers/GetTagStatusTransferDecision";

const { Text } = Typography;

export interface TransferDecisionApprovalProp {
    transferDecisionApproval: TransferDecisionApproval | null;
    employee: { id: number; name: string; }[];
}

const TransferDecisionApprovals: React.FC<TransferDecisionApprovalProp> = ({ transferDecisionApproval, employee }) => {
    return (
        <Card
            title="Đơn duyệt yêu cầu điều chuyển"
            bordered={false}
        >
            {transferDecisionApproval ? (
                <>
                    <Text strong>Trạng thái:</Text> {getStatusTagApprove(transferDecisionApproval?.approvalsAction as ApprovalsAction || '')}
                    <br />
                    <Text strong>Người duyệt:</Text> <Text>{employee.find((emp) => emp.id === transferDecisionApproval?.approverId)?.name || 'Chưa cập nhật'}</Text>
                    <br />
                    <Text strong>Mã đơn quyết định:</Text> {transferDecisionApproval?.decisionId}
                    <br />
                    <Text strong>Nhận xét:</Text> {transferDecisionApproval?.remarks}
                    <br />
                    <Text strong>Ngày duyệt:</Text> <Text>{transferDecisionApproval?.approvalDate ? dayjs(transferDecisionApproval.approvalDate).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text>
                    <br />
                </>
            ) : (
                <Text strong>Chưa có dữ liệu</Text>
            )}
        </Card>
    )
}

export default TransferDecisionApprovals;