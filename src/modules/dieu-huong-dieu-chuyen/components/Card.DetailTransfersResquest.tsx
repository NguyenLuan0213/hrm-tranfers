import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Popover, Typography } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, SendOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
//import data
import { TransferRequestStatus, TransfersRequest } from '../data/transfer_request';
import { Departments } from '../../phong-ban/data/department_data';
//import hooks
import { canEditRequest, canSubmitRequest, canCancelRequest } from '../hooks/transfer_request_authentication';
//import components
import { getStatusTag } from './GetTagStatusTransferRequest';

const { Text } = Typography;

interface CardDetailTransfersResquestProps {
    transfersRequestData: TransfersRequest | null;
    employee: ({ id: number; name: string; })[];
    departmentFrom: Departments | undefined;
    departmentTo: Departments | undefined;
    createdByEmployeeId?: number;
    selectedId?: number;
    setIsUpdating: (updating: boolean) => void;
    onDelete: () => void;
    showModal: () => void;
}

const CardDetailTransfersResquest: React.FC<CardDetailTransfersResquestProps> = ({
    transfersRequestData,
    departmentFrom,
    departmentTo,
    employee,
    createdByEmployeeId,
    selectedId,
    setIsUpdating,
    onDelete,
    showModal,
}) => {
    const navigate = useNavigate();

    return (
        <Card
            title="Chi tiết đơn yêu cầu điều chuyển"
            bordered={false}
            actions={[
                <Popover
                    placement="topLeft"
                    title="Quay lại danh sách"
                    overlayStyle={{ width: 150 }}
                >
                    <ArrowLeftOutlined
                        key="return"
                        onClick={() => navigate("/transfers/requests")}
                    />
                </Popover>,

                canEditRequest(transfersRequestData?.status as TransferRequestStatus, selectedId, createdByEmployeeId) ? (
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

                (canCancelRequest() ? (<Popover
                    placement="top"
                    title="Hủy đơn"
                    overlayStyle={{ width: 120 }}
                >
                    <DeleteOutlined
                        key="delete"
                        onClick={onDelete}
                    />
                </Popover>) : (null)),

                canSubmitRequest(transfersRequestData?.status as TransferRequestStatus, selectedId, createdByEmployeeId) ? (
                    <Popover
                        placement="top"
                        title="Nộp đơn"
                        overlayStyle={{ width: 120 }}
                    >
                        <SendOutlined
                            key="send"
                            onClick={showModal}
                        />
                    </Popover>
                ) : (null),
            ]}
        >
            <Text strong>ID:</Text> <Text>{transfersRequestData?.id}</Text>
            <br />
            <Text strong>Trạng thái:</Text> {getStatusTag(transfersRequestData?.status || TransferRequestStatus.DRAFT)}
            <br />
            <Text strong>Người tạo đơn:</Text> <Text>{employee.find((emp) => emp.id === createdByEmployeeId)?.name || 'Chưa cập nhật'}</Text>
            <br />
            <Text strong>Người đang duyệt:</Text> <Text>{employee.find((emp) => emp.id === transfersRequestData?.approverId)?.name || 'Chưa cập nhật'}</Text>
            <br />
            <Text strong>Từ nơi:</Text> <Text>{departmentFrom?.name || ''}</Text>
            <br />
            <Text strong>Đến nơi:</Text> <Text>{departmentTo?.name || ''}</Text>
            <br />
            <Text strong>Từ chức vụ:</Text> <Text>{transfersRequestData?.positionFrom}</Text>
            <br />
            <Text strong>Đến chức vụ:</Text> <Text>{transfersRequestData?.positionTo}</Text>
            <br />
            <Text strong>Từ địa chỉ:</Text> <Text>{transfersRequestData?.locationFrom}</Text>
            <br />
            <Text strong>Đến địa chỉ:</Text> <Text>{transfersRequestData?.locationTo}</Text>
            <br />
            <Text strong>Ngày tạo:</Text> <Text>{transfersRequestData?.createdAt ? dayjs(transfersRequestData.createdAt).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text>
            <br />
            <Text strong>Ngày duyệt đơn:</Text> <Text>{transfersRequestData?.updatedAt ? dayjs(transfersRequestData.updatedAt).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text>
            <br />
        </Card>
    );
};

export default CardDetailTransfersResquest;