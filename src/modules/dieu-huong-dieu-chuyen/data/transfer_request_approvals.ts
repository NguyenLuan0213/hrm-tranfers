export enum ApprovalStatus {
    SUBMIT = 'SUBMIT',
    REQUEST_EDIT = 'REQUEST_EDIT',
    APPROVE = 'APPROVE',
    REJECT = 'REJECT',
    CANCEL = 'CANCEL'
}

export interface ApprovalTransferRequest {
    id: number
    requestId: number;
    approverId: number | null;
    approvalsAction: ApprovalStatus;
    remarks: string | null;
    approvalDate: Date | null;
}

export let mockApprovalTransferRequest: ApprovalTransferRequest[] = [
    {
        id: 1,
        requestId: 1,
        approverId: 1,
        approvalsAction: ApprovalStatus.APPROVE,
        remarks: null,
        approvalDate: new Date(),
    },
    {
        id: 2,
        requestId: 2,
        approverId: 4,
        approvalsAction: ApprovalStatus.SUBMIT,
        remarks: null,
        approvalDate: new Date(),
    }
]

