import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Col, Row, Typography, Tag, Popover, Modal, message } from "antd";
import { ArrowLeftOutlined, CarryOutOutlined, DeleteOutlined, EditOutlined, SendOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
//Import dữ liệu
import { Departments } from "../../phong-ban/data/department_data";
import { TransfersRequest, TransferRequestStatus } from "../data/transfer_request";
import { ApprovalTransferRequest, ApprovalStatus } from "../data/transfer_request_approvals";
//Import services
import { getTransfersRequestById, sendTransferRequest } from "../services/transfers_request_services";
import { addApprovalTransfersRequest, getApprovalTransferRequests, updateApprovalTransferRequest } from "../services/transfer_request_approvals_services";
import { getNameEmployee } from "../../nhan-vien/services/employee_services";
import { getDepartment } from "../../phong-ban/services/department_services";
//Import components
import TransfersRequestForm from "../components/UpdateTransfersRequestForm";
import ApprovalTransferRequestForm from "../components/ApprovalTransferRequestForm";
import { getStatusTag, getStatusTagApprove } from "./GetTagStatusTransferRequest";
//Import hooks
import { useDeleteTransfersRequest } from "../hooks/use_delete_transfer_request";
import { useUpdateTransfersRequest } from "../hooks/use_update_transfer_request";
import { useUserRole } from "../../../hooks/UserRoleContext";
import useNotification from "../../../hooks/sen_notifitions";

const { Text } = Typography;

const DetailTransfersRequest: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [createdByEmployeeId, setCreatedByEmployeeId] = useState<number | undefined>(undefined);
    const [transfersRequestData, setTransfersRequestData] = useState<TransfersRequest | null>(null);
    const [employee, setEmployee] = useState<{ id: number; name: string; }[]>([]);
    const [departmentFrom, setDepartmentFrom] = useState<Departments | undefined>(undefined);
    const [departmentTo, setDepartmentTo] = useState<Departments | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [openModalApproval, setOpenModalApproval] = useState(false);
    const [approvalTransferRequest, setApprovalTransferRequest] = useState<ApprovalTransferRequest | null>(null);

    const { handleDelete } = useDeleteTransfersRequest();
    const { handleUpdate, loading: updating, error } = useUpdateTransfersRequest();
    const { selectedRole, selectedId, selectedDepartmentId } = useUserRole();
    const { sendNotification } = useNotification(); //Khai báo hàm gửi thông báo

    //Hàm lấy dữ liệu
    const fetchData = async () => {
        try {
            //lấy dữ liệu từ id
            setLoading(true);
            const transferData = await getTransfersRequestById(Number(id));
            //lấy id người tạo đơn
            setCreatedByEmployeeId(transferData?.createdByEmployeeId);
            //lấy dữ liệu đơn yêu cầu điều chuyển
            setTransfersRequestData(transferData || null);
            setLoading(false);
        } catch (error) {
            setTransfersRequestData(null);
        } finally {
            setLoading(false);
        }
    };

    //Thực hiện lấy dữ liệu khi
    useEffect(() => {
        //thực hiện lấy dữ liệu
        fetchData();
        fetchDataApproval();
        //kiểm tra quyền xem đơn
        if (selectedId === createdByEmployeeId) {
            message.warning('Bạn không có quyền xem đơn này');
            navigate("/transfers");
        }
    }, [id]);

    //lấy dữ liệu từ id của đơn duyệt yêu cầu điều chuyển
    const fetchDataApproval = async () => {
        const approvalTransferRequests = await getApprovalTransferRequests();
        const approvalTransferRequest = approvalTransferRequests.find(req => req.requestId === parseInt(id || '0'));
        setApprovalTransferRequest(approvalTransferRequest || null);
    };

    //lấy dữ liệu của Employee và Department
    useEffect(() => {
        const fetchEmployeeAndDepartments = async () => {
            if (transfersRequestData) {
                const employeeData = await getNameEmployee();
                setEmployee(employeeData);

                const departmentData = await getDepartment();
                setDepartmentFrom(departmentData.find(dept => dept.id === transfersRequestData.departmentIdFrom));
                setDepartmentTo(departmentData.find(dept => dept.id === transfersRequestData.departmentIdTo));
            }
        };
        fetchEmployeeAndDepartments();
    }, [transfersRequestData]);

    //Hàm hủy đơn
    const onDelete = () => {
        handleDelete(parseInt(id!), () => {
            navigate("/transfers");
        });
    };

    //Hàm hiển thị modal duyệt đơn
    const showModal = () => {
        setOpen(true);
    };

    //Hàm gửi đơn yêu cầu điều chuyển
    const handleOk = async () => {
        const approvalTransferRequests = await getApprovalTransferRequests();
        // trạng thái nháp đơn
        if (transfersRequestData?.status === TransferRequestStatus.DRAFT) {
            const send = await sendTransferRequest(parseInt(id!)); //gửi đơn yêu cầu điều chuyển
            if (send) {
                message.success('Nộp đơn thành công');
                //tạo mới Id
                const newId = approvalTransferRequests.length > 0
                    ? Math.max(...approvalTransferRequests.map(req => req.id)) + 1
                    : 1;
                //tạo mới ApprovalTransferRequest
                const newApprovalTransferRequest: ApprovalTransferRequest = {
                    id: newId,
                    requestId: parseInt(id || '0'),
                    approverId: 0,
                    approvalsAction: ApprovalStatus.SUBMIT,
                    remarks: '',
                    approvalDate: null,
                };
                //cập nhật dữ liệu mới cho ApprovalTransferRequestData
                setApprovalTransferRequest(newApprovalTransferRequest);
                await addApprovalTransfersRequest(newApprovalTransferRequest);
            } else {
                message.warning('Nộp đơn thất bại');
            }
            // trạng thái chỉnh sửa đơn sau khi bị yêu cầu chỉnh sửa
        } else if (transfersRequestData?.status === TransferRequestStatus.EDITING && approvalTransferRequest) {
            const send = await sendTransferRequest(parseInt(id!)); //gửi đơn yêu cầu điều chuyển
            if (send) {
                //cập nhật dữ liệu mới cho ApprovalTransferRequestData
                approvalTransferRequest.approvalsAction = ApprovalStatus.SUBMIT;
                updateApprovalTransferRequest(approvalTransferRequest);
                setApprovalTransferRequest(approvalTransferRequest);
                message.success('Chỉnh sửa đơn thành công');

                //gửi thông báo
                sendNotification(
                    "Thông báo duyệt đơn yêu cầu ID: " + transfersRequestData.id,
                    "Quản lý",
                    approvalTransferRequest?.approverId!,
                    "/transfers/detail/" + transfersRequestData?.id
                );
            } else {
                message.warning('Chỉnh sửa đơn thất bại');
            }
        } else {
            message.warning('Trạng thái không hợp lệ để nộp đơn');
        }
        setOpen(false);
    };

    //Hàm thoát khỏi modal
    const handleCancel = () => {
        setOpen(false);
    };

    //Kiểm tra trạng thái trước khi chỉnh sửa
    const isEditable = (status: TransferRequestStatus) => {
        return ![
            TransferRequestStatus.PENDING,
            TransferRequestStatus.APPROVED,
            TransferRequestStatus.REJECTED,
            TransferRequestStatus.CANCELLED
        ].includes(status);
    };

    //Kiểm tra trạng thái trước khi nộp đơn
    const isSendable = (status: TransferRequestStatus) => {
        return ![
            TransferRequestStatus.PENDING,
            TransferRequestStatus.APPROVED,
            TransferRequestStatus.REJECTED,
            TransferRequestStatus.CANCELLED
        ].includes(status);
    };

    //Kiểm tra trạng thái trước khi duyệt đơn
    const isApprovable = (status: TransferRequestStatus) => {
        return status === TransferRequestStatus.PENDING;
    };

    //Hàm cập nhật dữ liệu
    const hanleUpdateTransfersRequest = async (updatedTransfersRequest: TransfersRequest) => {
        const success = await handleUpdate(updatedTransfersRequest.id, updatedTransfersRequest);
        if (success) {
            setIsUpdating(false);
            fetchData();
        }
    }

    //Hàm duyệt đơn
    const handleApprovalSubmit = async (approvalTransferRequest: ApprovalTransferRequest) => {
        //Phần duyệt đơn yêu cầu điều chuyển
        const newApprovalTransferRequest: ApprovalTransferRequest = {   //tạo mới approvalTransferRequest
            ...approvalTransferRequest,
            requestId: parseInt(id || '0'),
        };
        await updateApprovalTransferRequest(newApprovalTransferRequest);    //cập nhật trạng thái mới cho ApprovaltransfersRequestData
        fetchDataApproval();
        setApprovalTransferRequest(newApprovalTransferRequest);    //cập nhật dữ liệu mới cho ApprovalTransferRequestData

        //Phần đơn yêu cầu điều chuyển
        if (transfersRequestData) { //xét trạng thái của transfersRequestData
            switch (newApprovalTransferRequest.approvalsAction as ApprovalStatus) {
                case ApprovalStatus.APPROVE:
                    transfersRequestData.status = TransferRequestStatus.APPROVED;
                    transfersRequestData.updatedAt = new Date();
                    break;
                case ApprovalStatus.REJECT:
                    transfersRequestData.status = TransferRequestStatus.REJECTED;
                    transfersRequestData.updatedAt = new Date();
                    break;
                case ApprovalStatus.CANCEL:
                    transfersRequestData.status = TransferRequestStatus.CANCELLED;
                    transfersRequestData.updatedAt = new Date();
                    break;
                case ApprovalStatus.REQUEST_EDIT:
                    transfersRequestData.status = TransferRequestStatus.EDITING;
                    transfersRequestData.updatedAt = new Date();
                    break;
                case ApprovalStatus.SUBMIT:
                    transfersRequestData.status = TransferRequestStatus.PENDING;
                    transfersRequestData.updatedAt = new Date();
                    break;
                default:
                    message.warning('Trạng thái không hợp lệ');
                    return;
            }
            //thêm dữ liệu mới cho transfersRequestData
            setTransfersRequestData({
                ...transfersRequestData,
                approverId: newApprovalTransferRequest.approverId,
            });

            //fetch dữ liệu mới xuống data
            const updatedTransfersRequestData = {
                ...transfersRequestData,
                approverId: newApprovalTransferRequest.approverId,
            };
            const success = await handleUpdate(updatedTransfersRequestData.id, updatedTransfersRequestData);
            if (success) {
                setTransfersRequestData(updatedTransfersRequestData);
            }
            //gửi thông báo
            sendNotification(
                "Thông báo duyệt đơn yêu cầu ID: " + transfersRequestData.id,
                "Nhân viên",
                transfersRequestData?.createdByEmployeeId!,
                "/transfers/detail/" + transfersRequestData?.id
            );

            //đóng modal
            setOpenModalApproval(false);
            fetchData();
        }
    };

    //Phân quyền cho việc duyệt đơn
    const canApprove = () => {
        if (selectedRole === 'Quản lý' && selectedDepartmentId === transfersRequestData?.departmentIdFrom) {
            return true;
        }
        return false;
    }

    //Phân quyền cho việc hủy đơn
    const canDelete = () => {
        if (selectedId === createdByEmployeeId && transfersRequestData?.status === 'DRAFT') {
            return true;
        }
        return false;
    }

    return (
        <div style={{ padding: 10 }}>
            <Row gutter={16}>
                <Col span={8}>
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
                                    onClick={() => navigate("/transfers")}
                                />
                            </Popover>,
                            isEditable(transfersRequestData?.status as TransferRequestStatus || '') && selectedId == createdByEmployeeId ? (
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
                            (canDelete() ? (<Popover
                                placement="top"
                                title="Hủy đơn"
                                overlayStyle={{ width: 120 }}
                            >
                                <DeleteOutlined
                                    key="delete"
                                    onClick={onDelete}
                                />
                            </Popover>) : (null)),

                            isSendable(transfersRequestData?.status as TransferRequestStatus || '') && selectedId == createdByEmployeeId && (
                                <Popover
                                    placement="top"
                                    title="Nộp đơn"
                                    overlayStyle={{ width: 120 }}
                                >
                                    <SendOutlined key="send" onClick={showModal} />
                                </Popover>
                            ),
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
                        <Text strong>Ngày tạo:</Text> <Text>{transfersRequestData?.createdAt ? dayjs(transfersRequestData.createdAt).format('DD/MM/YYYY') : 'N/A'}</Text>
                        <br />
                        <Text strong>Ngày duyệt đơn:</Text> <Text>{transfersRequestData?.updatedAt ? dayjs(transfersRequestData.updatedAt).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text>
                        <br />
                    </Card>
                </Col>
                {(
                    <Col span={8}>
                        <Card title="Đơn duyệt yêu cầu điều chuyển" bordered={false}>
                            {transfersRequestData?.status === TransferRequestStatus.CANCELLED ? (
                                <Text>Đơn đã bị hủy</Text>
                            ) : (
                                approvalTransferRequest && approvalTransferRequest.requestId === parseInt(id || '0') ? (
                                    <>
                                        <Text strong>Người duyệt:</Text> <Text>{employee.find((emp) => emp.id === approvalTransferRequest?.approverId)?.name || 'Chưa cập nhật'}</Text><br />
                                        <Text strong>Trạng thái:</Text> <Text>{getStatusTagApprove(approvalTransferRequest.approvalsAction)}</Text><br />
                                        <Text strong>Ngày duyệt:</Text> <Text>{approvalTransferRequest.approvalDate ? dayjs(approvalTransferRequest.approvalDate).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text><br />
                                        <Text strong>Ghi chú:</Text> <Text>{approvalTransferRequest.remarks}</Text><br />
                                    </>
                                ) : (
                                    "Chưa có dữ liệu"
                                )
                            )}
                        </Card>
                        {isApprovable(transfersRequestData?.status as TransferRequestStatus || '') && canApprove() ? (
                            <div style={{ marginTop: 15, justifyContent: "center", display: "flex" }}>
                                <Button type="primary" ghost size="large" onClick={() => setOpenModalApproval(true)}>
                                    <CarryOutOutlined />
                                    Duyệt đơn
                                </Button>
                            </div>
                        ) : (
                            <div style={{ marginTop: 15, justifyContent: "center", display: "flex", }}>
                                <Button type="primary" ghost disabled size="large">
                                    <CarryOutOutlined />
                                    Duyệt đơn
                                </Button>
                            </div>
                        )}
                    </Col>
                )}
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

            <Modal
                title={'Cập nhật đơn yêu cầu điều chuyển'}
                open={isUpdating}
                footer={null}
                onCancel={() => setIsUpdating(false)}
            >
                <TransfersRequestForm
                    transfersRequest={transfersRequestData}
                    onUpdate={hanleUpdateTransfersRequest}
                    onCancel={() => setIsUpdating(false)}
                />
            </Modal>

            <Modal
                title={'Duyệt yêu cầu điều chuyển'}
                open={openModalApproval}
                footer={null}
                onCancel={() => setOpenModalApproval(false)}
            >
                <ApprovalTransferRequestForm
                    requestId={parseInt(id || '0')}
                    approvalTransferRequest={approvalTransferRequest}
                    onSubmit={handleApprovalSubmit}
                    onCancel={() => setOpenModalApproval(false)}
                />
            </Modal>
        </div>
    );
};

export default DetailTransfersRequest;
