import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TransfersRequest, getTransfersRequestById } from "../data/TransfersRequest";
import { Button, Card, Col, Row, Typography, Tag, Dropdown, Popover } from "antd";
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


const DetailTransfersResquest: React.FC = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [transfersRequestData, setTransfersRequestData] = useState<TransfersRequest | undefined>(undefined);
    const [employee, setEmployee] = useState<Employee | undefined>(undefined);
    const [departmentFrom, setDepartmentFrom] = useState<Departments | undefined>(undefined);
    const [departmentTo, setDepartmentTo] = useState<Departments | undefined>(undefined);
    const { handleDelete } = UseDeleteTransfersRequest();

    useEffect(() => {
        const fetchData = async () => {
            const transferdata = await getTransfersRequestById(Number(id));
            setTransfersRequestData(transferdata);
            console.log(transferdata);
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
            navigate("/transfers"); // Điều hướng về trang danh sách transfer sau khi xóa thành công
        });
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
                            </Popover>
                            ,
                            <EditOutlined
                                key="edit"
                            // onClick={() => navigate("/transfersRequestDatas")}
                            />,
                            <DeleteOutlined
                                key="delete"
                                onClick={onDelete}
                            />,
                            <Popover
                                placement="topLeft"
                                title="Nộp đơn"
                                overlayStyle={{ width: 120 }}
                            >
                                <SendOutlined key="ellipsis" />
                            </Popover>
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
        </div>
    );
};

export default DetailTransfersResquest;
