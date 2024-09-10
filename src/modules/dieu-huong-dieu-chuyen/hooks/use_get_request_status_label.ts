import { TransferRequestStatus } from "../data/transfer_request";
import { ApprovalStatus } from "../data/transfer_request_approvals";

export const getRequestStatusLabel = (status: TransferRequestStatus): string => {
    const labels: Record<TransferRequestStatus, string> = {
        [TransferRequestStatus.EDITING]: 'Yêu cầu điều chỉnh',
        [TransferRequestStatus.REJECTED]: 'Từ chối duyệt',
        [TransferRequestStatus.DRAFT]: 'Bản nháp',
        [TransferRequestStatus.APPROVED]: 'Đã phê duyệt',
        [TransferRequestStatus.CANCELLED]: 'Đã hủy',
        [TransferRequestStatus.PENDING]: 'Chờ phê duyệt',
    };
    return labels[status];
};

export const getRequestApprovalStatusLabel = (status: ApprovalStatus): string => {
    const labels: Record<ApprovalStatus, string> = {
        [ApprovalStatus.SUBMIT]: 'Chờ phê duyệt',
        [ApprovalStatus.REQUEST_EDIT]: 'Yêu cầu chỉnh sửa',
        [ApprovalStatus.APPROVE]: 'Đã phê duyệt',
        [ApprovalStatus.REJECT]: 'Từ chối',
        [ApprovalStatus.CANCEL]: 'Hủy',
    };
    return labels[status];
};



