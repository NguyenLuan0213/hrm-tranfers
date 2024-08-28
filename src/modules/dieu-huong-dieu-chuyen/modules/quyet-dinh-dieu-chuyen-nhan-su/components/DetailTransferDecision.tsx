import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined, SendOutlined } from "@ant-design/icons";
import { Card, Col, message, Popover, Row, Tag, Typography, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTransferDecisionById, cancelTransferDecision, sendTransferDecision } from "../services/TransfersDecisionsService"
import { useUserRole } from "../../../../../hooks/UserRoleContext";
import { TransferDecision } from "../data/TransfersDecision"
import { getNameEmployee } from "../../../../nhan-vien/services/EmployeeServices";
import dayjs from "dayjs";
import UpdateTransferDecisionForm from "../components/UpdateTransferDecisionForm";

const { Text } = Typography;

const getStatusTag = (status: string) => {
    switch (status) {
        case 'DRAFT':
            return <Tag color="default">DRAFT</Tag>;
        case 'PENDING':
            return <Tag color="blue">PENDING</Tag>;
        case 'EDITING':
            return <Tag color="orange">EDITING</Tag>;
        case 'APPROVED':
            return <Tag color="green">APPROVED</Tag>;
        case 'REJECTED':
            return <Tag color="red">REJECTED</Tag>;
        case 'CANCELLED':
            return <Tag color="gray">CANCELLED</Tag>;
        default:
            return <Tag color="default">{status}</Tag>;
    }
};

const DetailTransferDecision: React.FC = () => {
    const { id } = useParams();
    const [transfersDecision, setTransfersDecisionData] = useState<TransferDecision | null>(null);
    const [createdByEmployeeId, setCreatedByEmployeeId] = useState<number | null>(null);
    const [employee, setEmployee] = useState<any[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);

    const { selectedId, selectedDepartment, selectedRole } = useUserRole();
    const navigate = useNavigate();


    const fetchData = async () => {
        if (id) {
            // Lấy dữ liệu đơn điều chuyển
            const data = await getTransferDecisionById(parseInt(id));
            setTransfersDecisionData(data);
            setCreatedByEmployeeId(data.createdByEmployeeId || null);
            console.log(data.createdByEmployeeId);

            // Lấy dữ liệu nhân viên
            const employeeData = await getNameEmployee();
            setEmployee(employeeData);
        } else {
            setTransfersDecisionData(null);
        }
    };
    useEffect(() => {

        fetchData();
    }, [id]);

    //Phân quyền xem trang
    useEffect(() => {
        if (createdByEmployeeId !== null) {
            if (selectedDepartment !== "Phòng giám đốc" && selectedId !== createdByEmployeeId &&
                (selectedRole !== "Quản lý" || selectedDepartment !== "Phòng nhân sự")) {
                navigate('/transfers/decisions');    //Chuyên hướng về trang danh sách
                message.error('Bạn không có quyền xem đơn này');
            }
        }
    }, [selectedId, createdByEmployeeId, selectedDepartment]);

    //Phân quyền chỉnh sửa
    const isEditable = (status: string) => {
        if (transfersDecision?.status === 'DRAFT' || transfersDecision?.status === 'EDITING') {
            return true;
        }
        return false;
    }

    //hàm chỉnh sửa quyết định điều chuyển
    const handleUpdateTransfersDecision = (updatedTransferDecision: TransferDecision) => {
        setTransfersDecisionData(updatedTransferDecision);
        setIsUpdating(false);
        fetchData();
        message.success('Cập nhật quyết định điều chuyển thành công');
    };

    //Phân quyền hủy quyết định điều chuyển
    const canCancel = () => {
        if (transfersDecision?.status === 'DRAFT' || transfersDecision?.status === 'EDITING' && selectedId === createdByEmployeeId) {
            return true;
        }
        return false;
    }

    //hàm hủy quyết định điều chuyển
    const onCancelTransferDecision = () => {
        Modal.confirm({
            title: 'Bạn có muốn hủy đơn này không?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'danger',
            cancelText: 'Hủy bỏ',
            onOk: async () => {
                await cancelTransferDecision(parseInt(id || ''));
                message.success('Hủy đơn điều chuyển thành công');
                fetchData();
            },
        });
    };

    const canSendTransferDecision = () => {
        if (transfersDecision?.status === 'DRAFT' && selectedId === createdByEmployeeId) {
            return true;
        }
        return false;
    }

    const handleSendTransferDecision = async () => {
        Modal.confirm({
            title: 'Bạn có muốn nộp đơn này không?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'danger',
            cancelText: 'Hủy bỏ',
            onOk: async () => {
                await sendTransferDecision(parseInt(id || ''));
                message.success('Nộp đơn điều chuyển thành công');
                fetchData();
            }
        });
    };

    return (
        <div style={{ padding: 10 }}>
            <Row gutter={16}>
                <Col span={8}>
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
                            isEditable(transfersDecision?.status || '') && selectedId == createdByEmployeeId ? (
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
                            (canCancel() ? (
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
                            ) : (null)),

                            canSendTransferDecision() ? (
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
                        <Text strong>Trạng thái:</Text> {getStatusTag(transfersDecision?.status || '')}
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
                        <Text strong>Ngày thực hiện:</Text> <Text>{transfersDecision?.effectiveDate ? dayjs(transfersDecision.createdAt).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text>
                        <br />
                    </Card>
                </Col>
            </Row>

            {/* Modal chỉnh sửa quyết định điều chuyển */}
            <Modal
                title="Chỉnh sửa quyết định điều chuyển"
                open={isUpdating}
                onCancel={() => setIsUpdating(false)}
                footer={null}
            >
                <UpdateTransferDecisionForm
                    transferDecision={transfersDecision}
                    onUpdate={handleUpdateTransfersDecision}
                    onCancel={() => setIsUpdating(false)}
                />
            </Modal>
        </div>
    );
}

export default DetailTransferDecision;
