import { TransferDecisionStatus, TransferDecision } from '../data/transfer_decision';
import { TransferDecisionApproval, ApprovalsAction } from "../data/transfer_decision_approvals";

//Phân quyền chỉnh sửa
export const isEditable = (transfersDecision?: TransferDecision, selectedId?: number, createdByEmployeeId?: number) => {
    if ((transfersDecision?.status === TransferDecisionStatus.DRAFT || transfersDecision?.status === TransferDecisionStatus.EDITING) &&
        selectedId === createdByEmployeeId) {
        return true;
    }
    return false;
}

//Phân quyền hủy quyết định điều chuyển
export const canCancel = (transfersDecision?: TransferDecision, selectedId?: number, createdByEmployeeId?: number) => {
    if ((transfersDecision?.status === TransferDecisionStatus.DRAFT || transfersDecision?.status === TransferDecisionStatus.EDITING)
        && selectedId === createdByEmployeeId) {
        return true;
    }
    return false;
}

//Phân quyền nộp quyết định điều chuyển
export const canSendTransferDecision = (transfersDecision?: TransferDecision, status?: TransferDecisionStatus, selectedId?: number, createdByEmployeeId?: number) => {
    if ((transfersDecision?.status === TransferDecisionStatus.DRAFT || transfersDecision?.status === TransferDecisionStatus.EDITING)
        && selectedId === createdByEmployeeId) {
        return true;
    }
    return false;
}
//Phân quyền duyệt đơn
export const canApprove = (
    transferDecisionApproval?: TransferDecisionApproval,
    transfersDecision?: TransferDecision,
    selectedId?: number,
    selectedDepartment?: string
) => {
    if (transferDecisionApproval?.approvalsAction === ApprovalsAction.SUBMIT) { //Điều kiện cần ở cả 2
        if (transferDecisionApproval?.approverId === selectedId) { //Nếu người duyệt là người đang đăng nhập
            return true;
        }
        if (transfersDecision?.status === TransferDecisionStatus.PENDING && selectedDepartment === 'Phòng giám đốc') { //Nếu đơn ở trạng thái PENDING và người đăng nhập là phòng giám đốc
            return true;
        }
    } else {
        return false;
    }
}

//Phân quyền thêm quyết định điều chuyển
export const canAdd = (selectedDepartment: string | undefined) => {
    return (selectedDepartment === 'Phòng nhân sự')
}

//Phân quyền chỉnh sửa quyết định điều chuyển
export const canEdit = (transfersDecision?: TransferDecision, selectedId?: number) => {
    const nonEditableStatuses = [
        TransferDecisionStatus.PENDING,
        TransferDecisionStatus.APPROVED,
        TransferDecisionStatus.REJECTED,
        TransferDecisionStatus.CANCELLED
    ];

    if (!nonEditableStatuses.includes(transfersDecision?.status as TransferDecisionStatus) &&
        selectedId === transfersDecision?.createdByEmployeeId) {
        return true;
    }
    return false;
}

// Kiểm tra xem người dùng có thể xem lịch sử yêu cầu hay không
export const canViewHistoryDecision = (
    selectedRole?: string,
    selectedDepartment?: string
) => {
    if (selectedDepartment === "Phòng giám đốc" ||
        selectedRole === 'Quản lý' && selectedDepartment === 'Phòng nhân sự') {
        {
            return true;
        }
    }
}