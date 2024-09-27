import React from 'react';
import { Card, Typography } from 'antd';
import dayjs from 'dayjs';
//import dữ liệu
import { TransferRequestStatus, TransfersRequest } from '../data/transfer-request';
//import component
import { getStatusTagApprove } from './GetTagStatusTransferRequest';
import { ApprovalTransferRequest } from '../data/transfer-request-approvals';

const { Text } = Typography;

export interface CardApprovalTransfersRequestProps {
    id: string;
    approvalTransferRequest?: ApprovalTransferRequest | null;
    employee: ({ id: number; name: string; })[];
    transfersRequestData: TransfersRequest | null;
}


const CardApprovalTransfersRequest: React.FC<CardApprovalTransfersRequestProps> = ({ id, approvalTransferRequest, employee, transfersRequestData }) => {
    return (
        <Card title="Đơn duyệt yêu cầu điều chuyển" bordered={false}>
            {transfersRequestData?.status === TransferRequestStatus.CANCELLED ? (
                <Text>Đơn đã bị hủy</Text>
            ) : (
                approvalTransferRequest && approvalTransferRequest.requestId === parseInt(id || '0') ? (
                    <>
                        <Text strong>Người duyệt:</Text> <Text>{employee.find((emp) => emp.id === approvalTransferRequest?.approverId)?.name || 'Chưa cập nhật'}</Text><br />
                        <Text strong>Trạng thái:</Text> <Text>{getStatusTagApprove(approvalTransferRequest.approvalsAction)}</Text><br />
                        <Text strong>Ngày duyệt:</Text> <Text>{approvalTransferRequest.approvalDate ? dayjs(approvalTransferRequest.approvalDate).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text><br />
                        <Text strong>Nhận xét:</Text> <Text>{approvalTransferRequest.remarks}</Text><br />
                    </>
                ) : (
                    "Chưa có dữ liệu"
                )
            )}
        </Card>
    );
};

export default CardApprovalTransfersRequest;
