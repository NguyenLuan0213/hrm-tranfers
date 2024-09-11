import { TransferRequestStatus, TransfersRequest } from "../data/transfer_request";

// Kiểm tra xem yêu cầu có thể chỉnh sửa hay không
export const canEditRequest = (status: TransferRequestStatus, selectedId?: number, createdByEmployeeId?: number) => {
    return ![
        TransferRequestStatus.PENDING,
        TransferRequestStatus.APPROVED,
        TransferRequestStatus.REJECTED,
        TransferRequestStatus.CANCELLED
    ].includes(status) && selectedId === createdByEmployeeId;
};

// Kiểm tra xem yêu cầu có thể gửi đi hay không
export const canSubmitRequest = (status: TransferRequestStatus, selectedId?: number, createdByEmployeeId?: number) => {
    return ![
        TransferRequestStatus.PENDING,
        TransferRequestStatus.APPROVED,
        TransferRequestStatus.REJECTED,
        TransferRequestStatus.CANCELLED
    ].includes(status) && selectedId === createdByEmployeeId;
};

// Kiểm tra xem yêu cầu có thể hủy hay không
export const canCancelRequest = (selectedId?: number, createdByEmployeeId?: number, transfersRequestData?: TransfersRequest) => {
    if (selectedId === createdByEmployeeId && transfersRequestData?.status === TransferRequestStatus.DRAFT) {
        return true;
    }
    return false;
}

// Kiểm tra xem yêu cầu có thể duyệt hay không
export const canApproveRequest = (
    selectedRole?: string,
    selectedDepartmentId?: number,
    status?: TransferRequestStatus,
    transfersRequestData?: TransfersRequest
) => {
    if (selectedRole === 'Quản lý' && selectedDepartmentId === transfersRequestData?.departmentIdFrom && status === TransferRequestStatus.PENDING) {
        {
            return true;
        }
    }
}

// Kiểm tra xem người dùng có thể thêm yêu cầu hay không
export const canAddRequest = (
    selectedRole?: string,
    selectedDepartment?: string,
    status?: TransferRequestStatus,
    selectedId?: number,
    createdByEmployeeId?: number
) => {
    if (
        selectedRole === 'Nhân viên' &&
        (selectedDepartment === 'Phòng kế toán' || selectedDepartment === 'Phòng kỹ thuật') &&
        ![
            TransferRequestStatus.PENDING,
            TransferRequestStatus.APPROVED,
            TransferRequestStatus.REJECTED,
            TransferRequestStatus.CANCELLED
        ].includes(status as TransferRequestStatus) &&
        selectedId === createdByEmployeeId
    ) {
        return true;
    }
    return false;
};

// Kiểm tra xem người dùng có thể xem chi tiết yêu cầu hay không
export const canViewRequestDetail = (
    selectedRole?: string,
    selectedDepartment?: string,
    selectedDepartmentId?: number,
    selectedId?: number,
    record?: TransfersRequest
) => {
    if (selectedRole === 'Nhân viên' && selectedDepartment === 'Phòng nhân sự' ||
        selectedRole === 'Quản lý' && selectedDepartment === 'Phòng nhân sự' ||
        selectedRole === 'Quản lý' && selectedDepartmentId === record?.departmentIdFrom ||
        selectedId === record?.createdByEmployeeId) {
        return true;
    }
    return false;
}
