export interface ApprovalTransferRequest {
    id: number
    requestId: number;
    approverId: number | null;
    approvalsAction: 'SUBMIT' | 'REQUEST_EDIT' | 'APPROVE' | 'REJECT' | 'CANCEL';
    remarks: string | null;
    approvalDate: Date | null;
}

export let mockApprovalTransferRequest: ApprovalTransferRequest[] = [
    {
        id: 1,
        requestId: 1,
        approverId: 1,
        approvalsAction: 'APPROVE',
        remarks: null,
        approvalDate: new Date(),
    },
    {
        id: 2,
        requestId: 2,
        approverId: 1,
        approvalsAction: 'SUBMIT',
        remarks: null,
        approvalDate: new Date(),
    }
]

