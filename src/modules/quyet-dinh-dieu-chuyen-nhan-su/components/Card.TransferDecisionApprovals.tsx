import React from "react";
import { Card, Typography } from "antd";
import dayjs from "dayjs";
//import dữ liệu
import { TransferDecisionApproval, ApprovalsAction } from "../data/transfer_decision_approvals";
import { Employee } from "../../nhan-vien/data/employees_data";
//import component
import { getStatusTagApprove } from "./GetTagStatusTransferDecision";

const { Text } = Typography;

export interface TransferDecisionApprovalProp {
    transferDecisionApproval: TransferDecisionApproval | null;
    employee: Employee[];

}

const TransferDecisionApprovals: React.FC<TransferDecisionApprovalProp> = ({ transferDecisionApproval, employee }) => {
    return (
        <Card
            title="Thông tin phê duyệt"
            bordered={false}
        >
            {transferDecisionApproval ? (
                <>
                    <Text strong>Trạng thái:</Text> {getStatusTagApprove(transferDecisionApproval?.approvalsAction as ApprovalsAction || '')}
                    <br />
                    <Text strong>Người duyệt:</Text> <Text>{employee.find((emp) => emp.id === transferDecisionApproval?.approverId)?.name || 'Chưa cập nhật'}</Text>
                    <br />
                    <Text strong>Mã đơn yêu cầu:</Text> {transferDecisionApproval?.decisionId}
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