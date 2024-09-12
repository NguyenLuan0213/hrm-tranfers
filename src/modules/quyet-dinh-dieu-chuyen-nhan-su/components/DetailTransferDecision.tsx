import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    CarryOutOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Col, message, Row, Modal, Button } from "antd";
//import dữ liệu
import { TransferDecisionApproval, ApprovalsAction } from "../data/transfer_decision_approvals";
import { TransferDecision, TransferDecisionStatus } from "../data/transfer_decision"
//import services
import {
    getTransferDecisionById,
    cancelTransferDecision,
    sendTransferDecision,
    updateApproveTransferDecision,
    updateEmployeeAlterApproval
} from "../services/transfer_decision_service"
import {
    addTransferDecisionApproval,
    getLengthTransferDecisionApprovals,
    getTransferDecisionApprovalsByDecisionId,
    updateTransferDecisionApproval
} from "../services/transfer_decision_approval_service";
import { getNameEmployee } from "../../nhan-vien/services/employee_services";
//import hooks
import { useUserRole } from "../../../hooks/UserRoleContext";
import useNotification from "../../../hooks/sen_notifitions";
import { canApprove } from "../hooks/transfer_decision_authentication";
//import components
import UpdateTransferDecisionForm from "./UpdateTransferDecisionForm";
import ApprovalForm from "./TransferDecisionApprovalForm"
import CardDetailTransferDecision from "./Card.DetailTransferDecision";
import CardTransferDecisionApprovals from "./Card.TransferDecisionApprovals";

const DetailTransferDecision: React.FC = () => {
    const { id } = useParams();
    const [transfersDecision, setTransfersDecisionData] = useState<TransferDecision | null>(null);
    const [createdByEmployeeId, setCreatedByEmployeeId] = useState<number | null>(null);
    const [employee, setEmployee] = useState<{ id: number; name: string; }[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [transferDecisionApproval, setTransferDecisionApproval] = useState<TransferDecisionApproval | null>(null);
    const [openModalApproval, setOpenModalApproval] = useState(false);
    const { sendNotification } = useNotification(); //Khai báo hàm gửi thông báo

    const { selectedId, selectedDepartment, selectedRole } = useUserRole();
    const navigate = useNavigate();

    //Lấy dữ liệu
    const fetchData = async () => {
        if (id) {
            // Lấy dữ liệu đơn điều chuyển
            const tds = await getTransferDecisionById(parseInt(id));
            setTransfersDecisionData(tds);
            setCreatedByEmployeeId(tds.createdByEmployeeId || null);

            // Lấy dữ liệu nhân viên
            const employeeData = await getNameEmployee();
            setEmployee(employeeData);

            // Lấy dữ liệu đơn phê duyệt
            let tda = await getTransferDecisionApprovalsByDecisionId(parseInt(id));
            if (!tda) {
                setTransferDecisionApproval(tda);
            }
            setTransferDecisionApproval(tda);
        } else {
            setTransfersDecisionData(null);
        }
    };

    //Lấy dữ liệu khi trang được load
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

    //hàm chỉnh sửa quyết định điều chuyển
    const handleUpdateTransfersDecision = (updatedTransferDecision: TransferDecision) => {
        setTransfersDecisionData(updatedTransferDecision);
        setIsUpdating(false);
        fetchData();
        message.success('Cập nhật quyết định điều chuyển thành công');
    };

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
                        approvalsAction: ApprovalsAction.CANCEL,
                        approvalDate: new Date(),
                        remarks: null,
                    };
                    await updateTransferDecisionApproval(transferDecisionApproval?.id || 0, newTransfersDecisionApproval); //Cập nhật dữ liệu
                }
                message.success('Hủy đơn điều chuyển thành công');
                fetchData();
            },
        });
    };

    //Hàm thêm phê duyệt
    const handleAddTransferDecisionApproval = async () => {
        //Nếu đơn điều chuyển ở trạng thái DRAFT thì tạo mới
        if (transfersDecision?.status === TransferDecisionStatus.DRAFT) {
            let fecthLength = await getLengthTransferDecisionApprovals();            //Lấy độ dài mảng
            const newTransferDecisionApproval: TransferDecisionApproval = {            //Tạo dữ liệu mới
                id: fecthLength + 1,
                decisionId: transfersDecision?.id ? transfersDecision.id : null,
                approverId: null,
                approvalsAction: ApprovalsAction.SUBMIT,
                approvalDate: null,
                remarks: null,
            };
            //thêm dữ liệu mới vào mảng
            await addTransferDecisionApproval(newTransferDecisionApproval);
            setTransferDecisionApproval(newTransferDecisionApproval);
        } else if (transfersDecision?.status === TransferDecisionStatus.EDITING && transferDecisionApproval) { //Nếu đơn điều chuyển ở trạng thái EDITING thì cập nhật 
            let fecthLength = await getLengthTransferDecisionApprovals();            //Lấy độ dài mảng
            const newTransferDecisionApproval: TransferDecisionApproval = {            //Tạo dữ liệu mới
                id: transferDecisionApproval?.id ? transferDecisionApproval.id : fecthLength + 1,
                decisionId: id ? parseInt(id) : null,
                approverId: transferDecisionApproval?.approverId || null,
                approvalsAction: ApprovalsAction.SUBMIT,
                approvalDate: transferDecisionApproval?.approvalDate,
                remarks: null,
            };
            //thêm dữ liệu mới vào mảng
            await updateTransferDecisionApproval(transferDecisionApproval?.id ?? 0, newTransferDecisionApproval);
            setTransferDecisionApproval(newTransferDecisionApproval);

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

    //Hàm duyệt đơn
    const handleApproval = async (approvalValue: TransferDecisionApproval) => {
        //Phần cập nhật trạng thái đơn phê duyệt
        const newTrans: TransferDecisionApproval = {
            ...approvalValue,
            approvalDate: new Date(),
            decisionId: transfersDecision?.id || null,
            approverId: selectedId || null,
        };
        await updateTransferDecisionApproval(transferDecisionApproval?.id ?? 0, newTrans || null);//Cập nhật dữ liệu
        setTransferDecisionApproval(newTrans);
        fetchData();
        message.success('Duyệt đơn thành công');

        //Dữ liệu trạng thái đơn phê duyệt khi hủy
        const newApprovalCancel: TransferDecisionApproval = {
            id: transferDecisionApproval?.id || 0,
            decisionId: transferDecisionApproval?.decisionId || null,
            approverId: null,
            approvalsAction: ApprovalsAction.SUBMIT,
            approvalDate: null,
            remarks: null,
        };

        // Phần cập nhật trạng thái quyết định điều chuyển
        if (transfersDecision) { // xét trạng thái của transfersDecision
            switch (newTrans.approvalsAction as ApprovalsAction) {
                case ApprovalsAction.APPROVE:
                    transfersDecision.status = TransferDecisionStatus.APPROVED;
                    transfersDecision.updatedAt = new Date();
                    transfersDecision.approverId = selectedId;
                    transfersDecision.effectiveDate = new Date();
                    await updateEmployeeAlterApproval(transfersDecision?.requestId || 0); //Cập nhật trạng thái nhân viên
                    break;
                case ApprovalsAction.REJECT:
                    transfersDecision.status = TransferDecisionStatus.REJECTED;
                    transfersDecision.updatedAt = new Date();
                    transfersDecision.approverId = selectedId;
                    transfersDecision.effectiveDate = null;
                    break;
                case ApprovalsAction.CANCEL:
                    transfersDecision.status = TransferDecisionStatus.PENDING;
                    transfersDecision.updatedAt = null;
                    transfersDecision.approverId = null;
                    transfersDecision.effectiveDate = null;
                    await updateTransferDecisionApproval(transferDecisionApproval?.id || 0, newApprovalCancel);//Cập nhật đơn phê duyệt
                    break;
                case ApprovalsAction.REQUEST_EDIT:
                    transfersDecision.status = TransferDecisionStatus.EDITING;
                    transfersDecision.updatedAt = new Date();
                    transfersDecision.approverId = selectedId;
                    transfersDecision.effectiveDate = null;
                    break;
                default:
                    message.warning('Trạng thái không hợp lệ');
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
                    <CardDetailTransferDecision
                        transfersDecision={transfersDecision}
                        employee={employee}
                        createdByEmployeeId={createdByEmployeeId}
                        setIsUpdating={setIsUpdating}
                        onCancelTransferDecision={onCancelTransferDecision}
                        handleSendTransferDecision={handleSendTransferDecision}
                    />
                </Col>
                <Col span={8}>
                    <CardTransferDecisionApprovals
                        transferDecisionApproval={transferDecisionApproval}
                        employee={employee}
                    />
                    {canApprove(transferDecisionApproval as TransferDecisionApproval, transfersDecision as TransferDecision, selectedId, selectedDepartment) ? (
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
