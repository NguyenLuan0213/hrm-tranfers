export interface ApprovalTransferRequest {
    id: number
    requestId: number;
    approverId: number | null;
    approvalsAction: 'SUBMIT' | 'REQUEST_EDIT' | 'APPROVE' | 'REJECT' | 'CANCEL';
    remarks: string | null;
    approvalDate: Date | null;
}

let mockApprovalTransferRequest: ApprovalTransferRequest[] = [
    {
        id: 1,
        requestId: 1,
        approverId: 1,
        approvalsAction: 'APPROVE',
        remarks: null,
        approvalDate: new Date(),
    }
]

export const getApprovalTransferRequests = async () => {
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