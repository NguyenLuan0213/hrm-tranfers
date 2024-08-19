import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TransfersRequest, getTransfersRequestById, SendTransferRequest } from "../data/TransfersRequest";
import { Button, Card, Col, Row, Typography, Tag, Popover, Alert, Modal } from "antd";
import dayjs from "dayjs";
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, SendOutlined } from "@ant-design/icons";
import { Employee, getEmployees } from "../../nhan-vien/data/EmployeesData";
import { Departments, getDepartment } from "../../phong-ban/data/DepartmentData";
import { UseDeleteTransfersRequest } from "../hooks/UseDeleteTransfersRequest";

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

const DetailTransfersRequest: React.FC = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [transfersRequestData, setTransfersRequestData] = useState<TransfersRequest | undefined>(undefined);
    const [employee, setEmployee] = useState<Employee | undefined>(undefined);
    const [departmentFrom, setDepartmentFrom] = useState<Departments | undefined>(undefined);
    const [departmentTo, setDepartmentTo] = useState<Departments | undefined>(undefined);
    const { handleDelete } = UseDeleteTransfersRequest();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const transferData = await getTransfersRequestById(Number(id));
            setTransfersRequestData(transferData);
            console.log(transferData);
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchEmployeeAndDepartments = async () => {
            if (transfersRequestData) {
                const employeeData = await getEmployees();
                setEmployee(employeeData.find(emp => emp.id === transfersRequestData.createdByEmployeeId));

                const departmentData = await getDepartment();
                setDepartmentFrom(departmentData.find(dept => dept.id === transfersRequestData.departmentIdFrom));
                setDepartmentTo(departmentData.find(dept => dept.id === transfersRequestData.departmentIdTo));
            }
        };
        fetchEmployeeAndDepartments();
    }, [transfersRequestData]);

    const onDelete = () => {
        handleDelete(parseInt(id!), () => {
            navigate("/transfers");
        });
    };

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async () => {
        const send = await SendTransferRequest(parseInt(id!));
        if (send) {
            <Alert message="Nộp đơn thành công" type="success" showIcon />;
        } else {
            <Alert message="Nộp đơn thất bại" type="warning" showIcon />;
        }
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const isEditable = (status: string) => {
        return !['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].includes(status);
    };

    const isSendable = (status: string) => {
        return !['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].includes(status);
    };

    return (
        <div style={{ padding: 10 }}>
            <Row gutter={16}>
                <Col span={8}>
                    <Card
                        title="Chi tiết đơn yêu cầu"
                        bordered={false}
                        actions={[
                            <Popover
                                placement="topLeft"
                                title="Quay lại danh sách"
                                overlayStyle={{ width: 150 }}
                            >
                                <ArrowLeftOutlined
                                    key="return"
                                    onClick={() => navigate("/transfers")}
                                />
                            </Popover>,
                            isEditable(transfersRequestData?.status || '') && (
                                <EditOutlined
                                    key="edit"
                                    onClick={() => {
                                        // Your edit logic here
                                    }}
                                />
                            ),
                            <DeleteOutlined
                                key="delete"
                                onClick={onDelete}
                            />,
                            isSendable(transfersRequestData?.status || '') && (
                                <Popover
                                    placement="topLeft"
                                    title="Nộp đơn"
                                    overlayStyle={{ width: 120 }}
                                >

                                    <SendOutlined key="send" onClick={showModal} />
                                </Popover>
                            )
                        ]}
                    >
                        <Text strong>ID:</Text> <Text>{transfersRequestData?.id}</Text><br />
                        <Text strong>Trạng thái:</Text> {getStatusTag(transfersRequestData?.status || '')}<br />
                        <Text strong>Người tạo đơn:</Text> <Text>{employee?.name || 'N/A'}</Text><br />
                        <Text strong>Người đang duyệt:</Text> <Text>{employee?.name || 'N/A'}</Text><br />
                        <Text strong>Từ nơi:</Text> <Text>{departmentFrom?.name || 'N/A'}</Text><br />
                        <Text strong>Đến nơi:</Text> <Text>{departmentTo?.name || 'N/A'}</Text><br />
                        <Text strong>Từ chức vụ:</Text> <Text>{transfersRequestData?.positionFrom}</Text><br />
                        <Text strong>Đến chức vụ:</Text> <Text>{transfersRequestData?.positionTo}</Text><br />
                        <Text strong>Từ địa chỉ:</Text> <Text>{transfersRequestData?.locationFrom}</Text><br />
                        <Text strong>Đến địa chỉ:</Text> <Text>{transfersRequestData?.locationTo}</Text><br />
                        <Text strong>Ngày tạo:</Text> <Text>{transfersRequestData?.createdAt ? dayjs(transfersRequestData.createdAt).format('DD/MM/YYYY') : 'N/A'}</Text><br />
                        <Text strong>Ngày duyệt đơn:</Text> <Text>{transfersRequestData?.updatedAt ? dayjs(transfersRequestData.updatedAt).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text><br />
                    </Card>
                </Col>
            </Row>

            <Modal
                open={open}
                title="Xác nhận"
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Có, Nộp đơn"
                cancelText="Không"
            >
                <p>Bạn có chắc chắn muốn nộp đơn không?</p>
            </Modal>
        </div>
    );
};

export default DetailTransfersRequest;
