export interface TransferDecisionApproval {
    id: number;
    decisionId: number | null;
    approverId: number | null;
    approvalDate?: Date | null;
    remarks?: string | null;
    approvalsAction: string | 'REQUEST_EDIT' | 'REJECT' | 'APPROVE' | 'SUBMIT' | 'CANCEL';
}

export let mockTransferDecisionApprovals: TransferDecisionApproval[] = [
    {
        id: 1,
        decisionId: 1,
        approverId: 1,
        approvalDate: new Date(),
        remarks: null,
        approvalsAction: 'APPROVE'
    },
    {
        id: 2,
        decisionId: 2,
        approverId: 1,
        approvalDate: null,
        remarks: null,
        approvalsAction: 'PENDING'
    }

];