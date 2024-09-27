import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Col, Row, Modal, message } from "antd";
import { CarryOutOutlined } from "@ant-design/icons";
//Import dữ liệu
import { Departments } from "../../phong-ban/data/department-data";
import { TransfersRequest, TransferRequestStatus } from "../data/transfer-request";
import { ApprovalTransferRequest, ApprovalStatus } from "../data/transfer-request-approvals";
//Import services
import { getTransfersRequestById, sendTransferRequest } from "../services/transfers-request-services";
import {
    addApprovalTransfersRequest,
    getApprovalTransferRequests,
    getLengthApprovalTransferRequest,
    getApprovalHistoryTransferRequest,
    updateApprovalTransferRequest
} from "../services/transfer-request-approvals-services";
import { getNameEmployee } from "../../nhan-vien/services/employee-services";
import { getDepartment } from "../../phong-ban/services/department-services";
//Import hooks
import { useDeleteTransfersRequest } from "../hooks/use-delete-transfer-request";
import { useUpdateTransfersRequest } from "../hooks/use-update-transfer-request";
import { useUserRole } from "../../../hooks/UserRoleContext";
import useNotification from "../../../hooks/sen-notifitions";
import { canApproveRequest, canViewHistoryRequest } from "../hooks/transfer-request-authentication";
//Import components
import TransfersRequestForm from "../components/UpdateTransfersRequestForm";
import ApprovalTransferRequestForm from "../components/ApprovalTransferRequestForm";
import CardDetailTransfersResquest from "./Card.DetailTransfersResquest";
import CardApprovalTransfersRequestProps from "./Card.ApprovalTransfersRequest";
import CardApprovalHistoryTransferRequest from "./Card.ApprovalHistoryTransferRequest";

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
    const [approvalHistoryTransferRequest, setApprovalHistoryTransferRequest] = useState<ApprovalTransferRequest[]>([]);

    const { handleDelete } = useDeleteTransfersRequest();
    const { handleUpdate, loading: updating, error } = useUpdateTransfersRequest();
    const { selectedRole, selectedId, selectedDepartmentId, selectedDepartment } = useUserRole();
    const { sendNotification } = useNotification(); //Khai báo hàm gửi thông báo

    //Hàm lấy dữ liệu từ id của đơn yêu cầu điều chuyển
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

    //Thực hiện lấy dữ liệu khi id thay đổi
    useEffect(() => {
        //thực hiện lấy dữ liệu
        fetchData();
        fetchDataApproval();
        //kiểm tra quyền xem đơn
        if (selectedId === createdByEmployeeId) {
            message.warning('Bạn không có quyền xem đơn này');
            navigate("/transfers/requests");
        }
    }, [id]);

    //lấy dữ liệu từ id của đơn duyệt yêu cầu điều chuyển
    const fetchDataApproval = async () => {
        const data = await getApprovalTransferRequests();
        const approvalTransferRequests = data.filter(req => req.requestId === parseInt(id || '0'));

        if (approvalTransferRequests.length > 0) {
            // Sắp xếp theo id để lấy đơn mới nhất
            approvalTransferRequests.sort((a, b) => b.id - a.id);

            setApprovalTransferRequest(approvalTransferRequests[0]);
        } else {
            setApprovalTransferRequest(null);
        }
    };

    //Lấy dữ liệu lịch sử duyệt đơn
    useEffect(() => {
        const fetchApprovalHistory = async () => {
            if (transfersRequestData) {
                let approvalHistory = await getApprovalHistoryTransferRequest(transfersRequestData.id);
                setApprovalHistoryTransferRequest(approvalHistory);
            }
        };
        fetchApprovalHistory();
    }, [transfersRequestData]);

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

    //Hàm nộp đơn yêu cầu điều chuyển
    const handleSendTransferRequest = async () => {
        if (!transfersRequestData) {
            message.warning('Không tìm thấy dữ liệu đơn yêu cầu điều chuyển');
            return;
        }
        try {
            setLoading(true);
            if (transfersRequestData.status === TransferRequestStatus.DRAFT) {
                const send = await sendTransferRequest(parseInt(id!));
                if (send) {
                    const newId = await getLengthApprovalTransferRequest(parseInt(id || '0'));
                    message.success('Nộp đơn thành công');
                    const newApprovalTransferRequest: ApprovalTransferRequest = {
                        id: newId + 1,
                        requestId: parseInt(id || '0'),
                        approverId: 0,
                        approvalsAction: ApprovalStatus.SUBMIT,
                        remarks: null,
                        approvalDate: null,
                    };
                    setApprovalTransferRequest(newApprovalTransferRequest);
                    setApprovalHistoryTransferRequest([...approvalHistoryTransferRequest, newApprovalTransferRequest]);
                    await addApprovalTransfersRequest(newApprovalTransferRequest);
                } else {
                    message.warning('Nộp đơn thất bại');
                }
            } else if (transfersRequestData.status === TransferRequestStatus.EDITING && approvalTransferRequest) {
                const send = await sendTransferRequest(parseInt(id!));
                if (send) {
                    const newId = await getLengthApprovalTransferRequest(parseInt(id || '0'));
                    const updatedApprovalTransferRequest = {
                        ...approvalTransferRequest,
                        id: newId + 1,
                        approvalsAction: ApprovalStatus.SUBMIT,
                        remarks: null
                    };
                    const result = await addApprovalTransfersRequest(updatedApprovalTransferRequest);
                    if (result) {
                        setApprovalTransferRequest(updatedApprovalTransferRequest);
                        setApprovalHistoryTransferRequest([...approvalHistoryTransferRequest, updatedApprovalTransferRequest]);
                        fetchDataApproval();
                        message.success('Chỉnh sửa đơn thành công');
                    } else {
                        message.warning('Chỉnh sửa đơn thất bại');
                    }
                    sendNotification(
                        "Thông báo duyệt đơn yêu cầu ID: " + transfersRequestData.id,
                        "Quản lý",
                        approvalTransferRequest.approverId!,
                        "/transfers/requests/detail/" + transfersRequestData.id
                    );
                } else {
                    message.warning('Chỉnh sửa đơn thất bại');
                }
            } else {
                message.warning('Trạng thái không hợp lệ để nộp đơn');
            }
        } catch (error) {
            message.error('Đã xảy ra lỗi khi nộp đơn');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    //Hàm thoát khỏi modal
    const handleCancel = () => {
        setOpen(false);
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
        const newId = await getLengthApprovalTransferRequest(parseInt(id || '0')); //tạo mới Id
        const newApprovalTransferRequest: ApprovalTransferRequest = { //tạo mới approvalTransferRequest khi duyệt đơn
            id: newId + 1,
            approvalDate: new Date(),
            approvalsAction: approvalTransferRequest.approvalsAction || ApprovalStatus.SUBMIT,
            approverId: approvalTransferRequest.approverId || null,
            remarks: approvalTransferRequest.remarks || null,
            requestId: parseInt(id || '0'),
        };
        const newCancelApprovalTransferRequest: ApprovalTransferRequest = {//tạo mới ApprovalTransferRequest khi hủy duyệt đơn
            id: newId + 1,
            requestId: parseInt(id || '0'),
            approverId: null,
            approvalsAction: ApprovalStatus.SUBMIT,
            remarks: null,
            approvalDate: null,
        };
        if (newApprovalTransferRequest.approvalsAction === ApprovalStatus.CANCEL) { //xét trạng thái khi hủy duyệt đơn
            await addApprovalTransfersRequest(newCancelApprovalTransferRequest);
            await updateApprovalTransferRequest(approvalTransferRequest);
            setApprovalTransferRequest(newCancelApprovalTransferRequest);
        } else {
            await addApprovalTransfersRequest(newApprovalTransferRequest);//cập nhật trạng thái mới cho ApprovaltransfersRequestData
            setApprovalTransferRequest(newApprovalTransferRequest);//cập nhật dữ liệu mới cho ApprovalTransferRequestData
            fetchDataApproval();
        }

        //Phần đơn yêu cầu điều chuyển
        if (transfersRequestData) { //xét trạng thái của transfersRequestData
            switch (newApprovalTransferRequest.approvalsAction as ApprovalStatus) {
                case ApprovalStatus.APPROVE:
                    transfersRequestData.status = TransferRequestStatus.APPROVED;
                    transfersRequestData.updatedAt = new Date();
                    transfersRequestData.approverId = newApprovalTransferRequest.approverId;
                    break;
                case ApprovalStatus.REJECT:
                    transfersRequestData.status = TransferRequestStatus.REJECTED;
                    transfersRequestData.updatedAt = new Date();
                    transfersRequestData.approverId = newApprovalTransferRequest.approverId;
                    break;
                case ApprovalStatus.CANCEL:
                    transfersRequestData.status = TransferRequestStatus.PENDING;
                    transfersRequestData.updatedAt = null;
                    transfersRequestData.approverId = null;
                    transfersRequestData.approverId = null;
                    break;
                case ApprovalStatus.REQUEST_EDIT:
                    transfersRequestData.status = TransferRequestStatus.EDITING;
                    transfersRequestData.updatedAt = new Date();
                    transfersRequestData.approverId = newApprovalTransferRequest.approverId;
                    break;
                case ApprovalStatus.SUBMIT:
                    transfersRequestData.status = TransferRequestStatus.PENDING;
                    transfersRequestData.updatedAt = new Date();
                    transfersRequestData.approverId = newApprovalTransferRequest.approverId;
                    break;
                default:
                    message.warning('Trạng thái không hợp lệ');
                    return;
            }

            //thêm dữ liệu mới cho transfersRequestData
            setTransfersRequestData({ ...transfersRequestData });
            //fetch dữ liệu mới xuống data
            const updatedTransfersRequestData = { ...transfersRequestData };
            const success = await handleUpdate(updatedTransfersRequestData.id, updatedTransfersRequestData);
            if (success) {
                setTransfersRequestData(updatedTransfersRequestData);
            }
            //gửi thông báo
            sendNotification(
                "Thông báo duyệt đơn yêu cầu ID: " + transfersRequestData.id,
                "Nhân viên",
                transfersRequestData?.createdByEmployeeId!,
                "/transfers/requests/detail/" + transfersRequestData?.id
            );

            //đóng modal
            setOpenModalApproval(false);
            fetchData();
        }
    };

    return (
        <div style={{ padding: 10 }}>
            <Row gutter={16}>
                <Col span={8}>
                    <CardDetailTransfersResquest
                        transfersRequestData={transfersRequestData}
                        departmentFrom={departmentFrom}
                        departmentTo={departmentTo}
                        employee={employee}
                        createdByEmployeeId={createdByEmployeeId}
                        selectedId={selectedId}
                        setIsUpdating={setIsUpdating}
                        onDelete={onDelete}
                        showModal={showModal}
                    />
                </Col>
                <Col span={8}>
                    <CardApprovalTransfersRequestProps
                        id={id || ''}
                        approvalTransferRequest={approvalTransferRequest}
                        employee={employee}
                        transfersRequestData={transfersRequestData}
                    />
                    {canApproveRequest(selectedRole, selectedDepartmentId, transfersRequestData?.status, transfersRequestData as TransfersRequest) ? (
                        <div style={{ marginTop: 15, justifyContent: "center", display: "flex" }}>
                            <Button type="primary" ghost size="large" onClick={() => setOpenModalApproval(true)}>
                                <CarryOutOutlined />
                                Duyệt đơn
                            </Button>
                        </div>
                    ) : (
                        null
                    )}
                </Col>
                {canViewHistoryRequest(selectedRole, selectedDepartmentId, transfersRequestData as TransfersRequest, selectedDepartment) ? (
                    <Col span={8}>
                        <CardApprovalHistoryTransferRequest
                            approvalHistoryTransferRequest={approvalHistoryTransferRequest}
                            employee={employee}
                        />
                    </Col>
                ) : null}
            </Row>

            <Modal
                open={open}
                title="Xác nhận"
                onOk={handleSendTransferRequest}
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
                    status={approvalTransferRequest?.approvalsAction as ApprovalStatus}
                    onSubmit={handleApprovalSubmit}
                    onCancel={() => setOpenModalApproval(false)}
                />
            </Modal>
        </div>
    );
};

export default DetailTransfersRequest;
