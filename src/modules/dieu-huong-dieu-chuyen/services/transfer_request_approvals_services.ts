import { ApprovalTransferRequest, mockApprovalTransferRequest } from '../data/transfer_request_approvals'

export const getApprovalTransferRequests = async (): Promise<ApprovalTransferRequest[]> => {
    return mockApprovalTransferRequest
}

export const addApprovalTransfersRequest = async (approvalTransferRequest: ApprovalTransferRequest) => {
    const newApprovalTransferRequest = { ...approvalTransferRequest, id: mockApprovalTransferRequest.length + 1 }
    mockApprovalTransferRequest.push(newApprovalTransferRequest)
    return newApprovalTransferRequest;
}

export const updateApprovalTransferRequest = async (approvalTransferRequest: ApprovalTransferRequest) => {
    const index = mockApprovalTransferRequest.findIndex(item => item.id === approvalTransferRequest.id)
    mockApprovalTransferRequest[index] = approvalTransferRequest
    return approvalTransferRequest;
}