import { ApprovalTransferRequest, mockApprovalTransferRequest, ApprovalStatus } from '../data/transfer-request-approvals'

export interface ApprovalTransferRequestHistory extends ApprovalTransferRequest {
    primaryId?: number; // Thêm thuộc tính primaryId
    id: number;
    approverId: number | null;
    approvalsAction: ApprovalStatus;
    remarks: string | null;
    approvalDate: Date | null;
}

//Lấy tất cả bản ghi
export const getApprovalTransferRequests = async (): Promise<ApprovalTransferRequest[]> => {
    return mockApprovalTransferRequest
}

//Lấy bản ghi theo id
export const addApprovalTransfersRequest = async (approvalTransferRequest: ApprovalTransferRequest): Promise<ApprovalTransferRequest | null> => {
    const newApprovalTransferRequest = { ...approvalTransferRequest, id: mockApprovalTransferRequest.length + 1 }
    mockApprovalTransferRequest.push(newApprovalTransferRequest)
    return newApprovalTransferRequest;
}

//Câp nhật bản ghi
export const updateApprovalTransferRequest = async (approvalTransferRequest: ApprovalTransferRequest): Promise<ApprovalTransferRequest | null> => {
    const index = mockApprovalTransferRequest.findIndex(item => item.id === approvalTransferRequest.id)
    mockApprovalTransferRequest[index] = approvalTransferRequest
    return approvalTransferRequest;
}

//Tính số lượng bản ghi
export const getLengthApprovalTransferRequest = async (id: number): Promise<number> => {
    return mockApprovalTransferRequest.length;
}

// Lấy lịch sử duyệt theo id và sắp xếp theo requestId
export const getApprovalHistoryTransferRequest = async (transferRequestId: number): Promise<ApprovalTransferRequestHistory[]> => {
    let history: ApprovalTransferRequestHistory[] = mockApprovalTransferRequest
        .filter(item => item.requestId === transferRequestId)
        .sort((a, b) => a.requestId - b.requestId)
        .map((item, index) => ({ ...item, primaryId: index + 1 })); // Thêm primaryId
    return history;
}