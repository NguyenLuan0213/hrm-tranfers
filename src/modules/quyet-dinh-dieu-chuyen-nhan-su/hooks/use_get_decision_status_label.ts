import { TransferDecisionStatus } from '../data/transfer_decision';
import { ApprovalsAction } from '../data/transfer_decision_approvals';

export const getDecisionStatusLabel = (status: TransferDecisionStatus): string => {
    const labels: Record<TransferDecisionStatus, string> = {
        [TransferDecisionStatus.EDITING]: 'Yêu cầu điều chỉnh',
        [TransferDecisionStatus.REJECTED]: 'Từ chối duyệt',
        [TransferDecisionStatus.DRAFT]: 'Bản nháp',
        [TransferDecisionStatus.APPROVED]: 'Đã phê duyệt',
        [TransferDecisionStatus.CANCELLED]: 'Đã hủy',
        [TransferDecisionStatus.PENDING]: 'Chờ phê duyệt',
    };
    return labels[status];
}

export const getDecisionApprovalStatusLabel = (status: ApprovalsAction): string => {
    const labels: Record<ApprovalsAction, string> = {
        [ApprovalsAction.SUBMIT]: 'Chờ phê duyệt',
        [ApprovalsAction.REQUEST_EDIT]: 'Yêu cầu chỉnh sửa',
        [ApprovalsAction.APPROVE]: 'Đã phê duyệt',
        [ApprovalsAction.REJECT]: 'Từ chối',
        [ApprovalsAction.CANCEL]: 'Hủy',
    };
    return labels[status];
};