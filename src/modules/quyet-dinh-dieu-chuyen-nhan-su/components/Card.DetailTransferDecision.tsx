import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Popover, Typography } from "antd";
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, SendOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
//import dữ liệu
import { TransferDecision, TransferDecisionStatus } from "../data/transfer_decision";
//import component
import { getStatusTag } from "./GetTagStatusTransferDecision";
//import hooks
import { isEditable, canCancel, canSendTransferDecision } from "../hooks/transfer_decision_authentication";
import { useUserRole } from "../../../hooks/UserRoleContext";

const { Text } = Typography;

export interface CardDetailTransferDecisionProps {
    transfersDecision: TransferDecision | null;
    employee: { id: number; name: string; }[];
    createdByEmployeeId: number | null;
    setIsUpdating: (isUpdating: boolean) => void;
    onCancelTransferDecision: () => void;
    handleSendTransferDecision: () => void;
}

const CardDetailTransferDecision: React.FC<CardDetailTransferDecisionProps> = ({
    transfersDecision,
    employee,
    createdByEmployeeId,
    setIsUpdating,
    onCancelTransferDecision,
    handleSendTransferDecision,
}) => {
    const navigate = useNavigate();
    const { selectedId } = useUserRole();

    return (
        <Card
            title="Chi tiết đơn quyết định điều chuyển"
            bordered={false}
            actions={[
                <Popover
                    placement="topLeft"
                    title="Quay lại danh sách"
                    overlayStyle={{ width: 150 }}
                >
                    <ArrowLeftOutlined
                        key="return"
                        onClick={() => navigate("/transfers/decisions")}
                    />
                </Popover>,
                isEditable(transfersDecision || undefined, selectedId, createdByEmployeeId !== null ? createdByEmployeeId : undefined) ? (
                    <Popover
                        placement="top"
                        title="Chỉnh sửa"
                        overlayStyle={{ width: 120 }}
                    >
                        <EditOutlined
                            key="edit"
                            onClick={() => {
                                setIsUpdating(true);
                            }}
                        />
                    </Popover>
                ) : (null),

                canCancel(transfersDecision || undefined, selectedId, createdByEmployeeId !== null ? createdByEmployeeId : undefined) ? (
                    <Popover
                        placement="top"
                        title="Hủy đơn"
                        overlayStyle={{ width: 120 }}
                    >
                        <DeleteOutlined
                            key="delete"
                            onClick={onCancelTransferDecision}
                        />
                    </Popover>
                ) : (null),

                canSendTransferDecision(transfersDecision || undefined, transfersDecision?.status, selectedId, createdByEmployeeId !== null ? createdByEmployeeId : undefined) ? (
                    <Popover
                        placement="top"
                        title="Nộp đơn"
                        overlayStyle={{ width: 120 }}

                    >
                        <SendOutlined key="send"
                            onClick={handleSendTransferDecision}
                        />
                    </Popover>
                ) : (null),
            ]}
        >
            <Text strong>ID:</Text> <Text>{transfersDecision?.id}</Text>
            <br />
            <Text strong>Trạng thái:</Text> {getStatusTag(transfersDecision?.status as TransferDecisionStatus || '')}
            <br />
            <Text strong>Mã đơn yêu cầu:</Text> {transfersDecision?.requestId}
            <br />
            <Text strong>Người tạo đơn:</Text> <Text>{employee.find((emp) => emp.id === createdByEmployeeId)?.name || 'Chưa cập nhật'}</Text>
            <br />
            <Text strong>Người đang duyệt:</Text> <Text>{employee.find((emp) => emp.id === transfersDecision?.approverId)?.name || 'Chưa cập nhật'}</Text>
            <br />
            <Text strong>Ngày tạo:</Text> <Text>{transfersDecision?.createdAt ? dayjs(transfersDecision.createdAt).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text>
            <br />
            <Text strong>Ngày duyệt đơn:</Text> <Text>{transfersDecision?.updatedAt ? dayjs(transfersDecision.updatedAt).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text>
            <br />
            <Text strong>Ngày thực hiện:</Text>
            <Text>
                {transfersDecision?.status === TransferDecisionStatus.REJECTED || transfersDecision?.status === TransferDecisionStatus.CANCELLED
                    ? 'Đã bỏ'
                    : transfersDecision?.effectiveDate
                        ? dayjs(transfersDecision.effectiveDate).format('DD/MM/YYYY')
                        : 'Chưa cập nhật'}
            </Text>
            <br />
        </Card>
    )
}

export default CardDetailTransferDecision;