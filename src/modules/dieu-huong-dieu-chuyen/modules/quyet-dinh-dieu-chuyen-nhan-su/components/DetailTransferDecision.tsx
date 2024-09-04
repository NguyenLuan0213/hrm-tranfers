import { ArrowLeftOutlined, CarryOutOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined, SendOutlined } from "@ant-design/icons";
import { Card, Col, message, Popover, Row, Tag, Typography, Modal, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getTransferDecisionById,
    cancelTransferDecision,
    sendTransferDecision,
    updateApproveTransferDecision,
    updateEmployeeAlterApproval
} from "../services/TransfersDecisionsService"
import { useUserRole } from "../../../../../hooks/UserRoleContext";
import { TransferDecision } from "../data/TransfersDecision"
import { getNameEmployee } from "../../../../nhan-vien/services/EmployeeServices";
import UpdateTransferDecisionForm from "../components/UpdateTransferDecisionForm";
import dayjs from "dayjs";
import {
    addTransferDecisionApproval,
    getLengthTransferDecisionApprovals,
    getTransferDecisionApprovalsByDecisionId,
    UpdateTransferDecisionApproval
} from "../services/TransferDecisionApprovalService";
import { TransferDecisionApproval } from "../data/TransferDecisionApprovals";
import ApprovalForm from "../components/TransferDecisionApprovalForm"
import useNotification from "../../../../../hooks/SenNotifitions";


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

const getStatusTagApproval = (status: string) => {
    switch (status) {
        case 'SUBMIT':
            return <Tag color="default">SUBMIT</Tag>;
        case 'REQUEST_EDIT':
            return <Tag color="blue">REQUEST_EDIT</Tag>;
        case 'APPROVE':
            return <Tag color="green">APPROVE</Tag>;
        case 'REJECT':
            return <Tag color="red">REJECT</Tag>;
        case 'CANCEL':
            return <Tag color="gray">CANCEL</Tag>;
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
    const [transferDecisionApproval, setTransferDecisionApproval] = useState<TransferDecisionApproval | null>(null);
    const [openModalApproval, setOpenModalApproval] = useState(false);
    const { sendNotification } = useNotification(); //Khai báo hàm gửi thông báo

    const { selectedId, selectedDepartment, selectedRole } = useUserRole();
    const navigate = useNavigate();

    const fetchData = async () => {
        if (id) {
            // Lấy dữ liệu đơn điều chuyển
            const tds = await getTransferDecisionById(parseInt(id));
            setTransfersDecisionData(tds);
            setCreatedByEmployeeId(tds.createdByEmployeeId || null);
            console.log(tds.createdByEmployeeId);

            // Lấy dữ liệu nhân viên
            const employeeData = await getNameEmployee();
            setEmployee(employeeData);

            // Lấy dữ liệu đơn phê duyệt
            let tda = await getTransferDecisionApprovalsByDecisionId(parseInt(id));
            console.log(tda);
            if (!tda) {
                setTransferDecisionApproval(tda);
            }
            setTransferDecisionApproval(tda);
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
        if ((transfersDecision?.status === 'DRAFT' || transfersDecision?.status === 'EDITING') && selectedId === createdByEmployeeId) {
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
                if (transferDecisionApproval) {  //Nếu có dữ liệu phê duyệt thì cập nhật
                    const newTransfersDecisionApproval: TransferDecisionApproval = {
                        id: transferDecisionApproval?.id || 0,
                        decisionId: transferDecisionApproval?.decisionId || null,
                        approverId: transferDecisionApproval?.approverId || null,
                        approvalsAction: 'CANCEL',
                        approvalDate: new Date(),
                        remarks: null,
                    };
                    await UpdateTransferDecisionApproval(transferDecisionApproval?.id || 0, newTransfersDecisionApproval); //Cập nhật dữ liệu
                }
                message.success('Hủy đơn điều chuyển thành công');
                fetchData();
            },
        });
    };

    //Phân quyền nộp quyết định điều chuyển
    const canSendTransferDecision = () => {
        if ((transfersDecision?.status === 'DRAFT' || transfersDecision?.status === "EDITING") && selectedId === createdByEmployeeId) {
            return true;
        }
        return false;
    }

    //Hàm thêm phê duyệt
    const handleAddTransferDecisionApproval = async () => {
        //Nếu đơn điều chuyển ở trạng thái DRAFT thì tạo mới
        if (transfersDecision?.status === 'DRAFT') {
            let fecthLength = await getLengthTransferDecisionApprovals();            //Lấy độ dài mảng
            console.log(fecthLength);
            const newTransferDecisionApproval: TransferDecisionApproval = {            //Tạo dữ liệu mới
                id: fecthLength + 1,
                decisionId: transfersDecision?.id ? transfersDecision.id : null,
                approverId: null,
                approvalsAction: 'SUBMIT',
                approvalDate: null,
                remarks: null,
            };
            //thêm dữ liệu mới vào mảng
            await addTransferDecisionApproval(newTransferDecisionApproval);
            setTransferDecisionApproval(newTransferDecisionApproval);
        } else if (transfersDecision?.status === 'EDITING' && transferDecisionApproval) { //Nếu đơn điều chuyển ở trạng thái EDITING thì cập nhật 
            let fecthLength = await getLengthTransferDecisionApprovals();            //Lấy độ dài mảng
            const newTransferDecisionApproval: TransferDecisionApproval = {            //Tạo dữ liệu mới
                id: transferDecisionApproval?.id ? transferDecisionApproval.id : fecthLength + 1,
                decisionId: id ? parseInt(id) : null,
                approverId: transferDecisionApproval?.approverId || null,
                approvalsAction: 'SUBMIT',
                approvalDate: transferDecisionApproval?.approvalDate,
                remarks: null,
            };
            console.log(newTransferDecisionApproval);
            //thêm dữ liệu mới vào mảng
            await UpdateTransferDecisionApproval(transferDecisionApproval?.id ?? 0, newTransferDecisionApproval);
            setTransferDecisionApproval(newTransferDecisionApproval);
            console.log(newTransferDecisionApproval);

            //Gửi thông báo
            sendNotification(
                "Thông báo duyệt đơn quyết định ID: " + transfersDecision?.id,
                "Ban giám đốc",
                transferDecisionApproval?.approverId!,
                "/transfers/decisions/detail/" + transfersDecision?.id
            );
        } else {
            message.warning('Invalid approval action');
        }
    };

    //Hàm gửi quyết định điều chuyển
    const handleSendTransferDecision = async () => {
        Modal.confirm({
            title: 'Bạn có muốn nộp đơn này không?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'danger',
            cancelText: 'Hủy bỏ',
            onOk: async () => {
                //Hàm phê duyệt
                handleAddTransferDecisionApproval();
                //thay đổi trạng thái đơn
                await sendTransferDecision(parseInt(id || ''));
                message.success('Nộp đơn điều chuyển thành công');
                fetchData();
            }
        });
    };

    //Phân quyền duyệt đơn
    const canApprove = () => {
        if (transferDecisionApproval?.approvalsAction === 'SUBMIT') { //Điều kiện cần ở cả 2
            if (transferDecisionApproval?.approverId === selectedId) { //Nếu người duyệt là người đang đăng nhập
                return true;
            }
            if (transfersDecision?.status === 'PENDING' && selectedDepartment === 'Phòng giám đốc') { //Nếu đơn ở trạng thái PENDING và người đăng nhập là phòng giám đốc
                return true;
            }
        } else {
            return false;
        }
    }

    //Hàm duyệt đơn
    const handleApproval = async (approvalValue: TransferDecisionApproval) => {
        //Phần cập nhật trạng thái đơn phê duyệt
        const newTrans: TransferDecisionApproval = {
            ...approvalValue,
            approvalDate: new Date(),
            decisionId: transfersDecision?.id || null,
            approverId: selectedId || null,
        };
        await UpdateTransferDecisionApproval(transferDecisionApproval?.id ?? 0, newTrans || null);//Cập nhật dữ liệu
        setTransferDecisionApproval(newTrans);
        fetchData();
        message.success('Duyệt đơn thành công');

        //Dữ liệu trạng thái đơn phê duyệt khi hủy
        const newApprovalCancel: TransferDecisionApproval = {
            id: transferDecisionApproval?.id || 0,
            decisionId: transferDecisionApproval?.decisionId || null,
            approverId: null,
            approvalsAction: 'SUBMIT',
            approvalDate: null,
            remarks: null,
        };

        // Phần cập nhật trạng thái quyết định điều chuyển
        if (transfersDecision) { // xét trạng thái của transfersDecision
            switch (newTrans.approvalsAction) {
                case 'APPROVE':
                    transfersDecision.status = 'APPROVED';
                    transfersDecision.updatedAt = new Date();
                    transfersDecision.approverId = selectedId;
                    transfersDecision.effectiveDate = new Date();
                    await updateEmployeeAlterApproval(transfersDecision?.requestId || 0); //Cập nhật trạng thái nhân viên
                    break;
                case 'REJECT':
                    transfersDecision.status = 'REJECTED';
                    transfersDecision.updatedAt = new Date();
                    transfersDecision.approverId = selectedId;
                    transfersDecision.effectiveDate = null;
                    break;
                case 'CANCEL':
                    transfersDecision.status = 'PENDING';
                    transfersDecision.updatedAt = null;
                    transfersDecision.approverId = null;
                    transfersDecision.effectiveDate = null;
                    await UpdateTransferDecisionApproval(transferDecisionApproval?.id || 0, newApprovalCancel);//Cập nhật đơn phê duyệt
                    break;
                case 'REQUEST_EDIT':
                    transfersDecision.status = 'EDITING';
                    transfersDecision.updatedAt = new Date();
                    transfersDecision.approverId = selectedId;
                    transfersDecision.effectiveDate = null;
                    break;
                default:
                    message.warning('Invalid approval action');
                    return;
            }
            await updateApproveTransferDecision(transfersDecision.id, transfersDecision);
            setTransfersDecisionData(transfersDecision);
        }

        //Gửi thông báo
        sendNotification(
            "Thông báo duyệt đơn quyết định ID: " + transfersDecision?.id,
            "Nhân viên",
            createdByEmployeeId!,
            "/transfers/decisions/detail/" + transfersDecision?.id
        );

        //Cập nhật dữ liệu
        fetchData();
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
                        <Text strong>Ngày thực hiện:</Text>
                        <Text>
                            {transfersDecision?.status === 'REJECTED' || transfersDecision?.status === 'CANCELLED'
                                ? 'Đã bỏ'
                                : transfersDecision?.effectiveDate
                                    ? dayjs(transfersDecision.effectiveDate).format('DD/MM/YYYY')
                                    : 'Chưa cập nhật'}
                        </Text>
                        <br />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card
                        title="Thông tin phê duyệt"
                        bordered={false}
                    >
                        {transferDecisionApproval ? (
                            <>
                                <Text strong>ID:</Text> <Text>{transferDecisionApproval?.id}</Text>
                                <br />
                                <Text strong>Trạng thái:</Text> {getStatusTagApproval(transferDecisionApproval?.approvalsAction || '')}
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
                    {canApprove() ? (
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

            {/* Modal duyệt đơn quyết định điều chuyển */}
            <Modal
                title="Duyệt đơn quyết định điều chuyển"
                open={openModalApproval}
                onCancel={() => setOpenModalApproval(false)}
                footer={null}
            >
                <ApprovalForm
                    transferDecisionApproval={transferDecisionApproval || undefined}
                    onUpdate={handleApproval}
                    onCancel={() => setOpenModalApproval(false)}
                />
            </Modal>
        </div>
    );
}

export default DetailTransferDecision;
