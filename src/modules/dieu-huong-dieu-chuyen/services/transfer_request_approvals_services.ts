import { ApprovalTransferRequest, mockApprovalTransferRequest } from '../data/transfer_request_approvals'

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