import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Popover, Spin, Typography } from "antd";
import { ArrowLeftOutlined, DeleteOutlined, DownOutlined, EditOutlined, SendOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
//import dữ liệu
import { TransferDecision, TransferDecisionStatus } from "../data/transfer_decision";
import { TransferRequestStatus } from "../../dieu-huong-dieu-chuyen/data/transfer_request";
//import component
import { getStatusTag } from "./GetTagStatusTransferDecision";
//import hooks
import { isEditable, canCancel, canSendTransferDecision } from "../hooks/transfer_decision_authentication";
import { useUserRole } from "../../../hooks/UserRoleContext";
//import service
import { getDepartment } from "../../phong-ban/services/department_services";
import { getTransfersRequestById } from "../../dieu-huong-dieu-chuyen/services/transfers_request_services";
import { Departments } from "../../phong-ban/data/department_data";

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
    const [requestInfo, setRequestInfo] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [department, setDepartment] = useState<any>(null);

    useEffect(() => {
        const fetchRequestInfo = async () => {
            if (transfersDecision?.requestId) {
                setLoading(true);
                const info = await getTransfersRequestById(transfersDecision.requestId);
                setRequestInfo(info);
                setLoading(false);
            }
        };
        fetchRequestInfo();
    }, [transfersDecision?.requestId]);

    useEffect(() => {
        const fetchDepartment = async () => {
            const departmentData = await getDepartment();
            setDepartment(departmentData);
        };
        fetchDepartment();
    }, []);

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
                <Popover
                    placement="bottomRight"
                    title="Thông tin đơn yêu cầu điều chuyển"
                    content={
                        loading ? (
                            <Spin />
                        ) : requestInfo ? (
                            <div>
                                <Text strong>ID:</Text> <Text>{requestInfo?.id}</Text>
                                <br />
                                <Text strong>Trạng thái:</Text> {getStatusTag(requestInfo?.status || TransferRequestStatus.DRAFT)}
                                <br />
                                <Text strong>Người tạo đơn:</Text> <Text>{employee.find((emp) => emp.id === requestInfo.createdByEmployeeId)?.name || 'Chưa cập nhật'}</Text>
                                <br />
                                <Text strong>Người đã duyệt:</Text> <Text>{employee.find((emp) => emp.id === requestInfo?.approverId)?.name || 'Chưa cập nhật'}</Text>
                                <br />
                                <Text strong>Từ nơi:</Text> <Text>{department.find((dep: Departments) => dep.id === requestInfo?.departmentIdFrom)?.name}</Text>
                                <br />
                                <Text strong>Đến nơi:</Text> <Text>{department.find((dep: Departments) => dep.id === requestInfo?.departmentIdTo)?.name}</Text>
                                <br />
                                <Text strong>Từ chức vụ:</Text> <Text>{requestInfo?.positionFrom}</Text>
                                <br />
                                <Text strong>Đến chức vụ:</Text> <Text>{requestInfo?.positionTo}</Text>
                                <br />
                                <Text strong>Từ địa chỉ:</Text> <Text>{requestInfo?.locationFrom}</Text>
                                <br />
                                <Text strong>Đến địa chỉ:</Text> <Text>{requestInfo?.locationTo}</Text>
                                <br />
                                <Text strong>Ngày tạo:</Text> <Text>{requestInfo?.createdAt ? dayjs(requestInfo.createdAt).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text>
                                <br />
                                <Text strong>Ngày duyệt đơn:</Text> <Text>{requestInfo?.updatedAt ? dayjs(requestInfo.updatedAt).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text>
                                <br />
                            </div>
                        ) : (
                            <Text>Không có thông tin</Text>
                        )
                    }
                    overlayStyle={{ width: 260 }}
                >
                    <DownOutlined
                        key="info"
                    />
                </Popover>
            ]}
        >
            <Text strong>ID:</Text> <Text>{transfersDecision?.id}</Text>
            <br />
            <Text strong>Trạng thái:</Text> {getStatusTag(transfersDecision?.status as TransferDecisionStatus || '')}
            <br />
            <Text strong>Mã đơn yêu cầu điều chuyển:</Text> {transfersDecision?.requestId}
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