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
        approverId: null,
        approvalDate: null,
        remarks: null,
        approvalsAction: 'SUBMIT'
    },
    {
        id: 3,
        decisionId: 3,
        approverId: 1,
        approvalDate: new Date(),
        remarks: null,
        approvalsAction: 'REJECT'
    },
    {
        id: 4,
        decisionId: 4,
        approverId: 1,
        approvalDate: new Date(),
        remarks: null,
        approvalsAction: 'REQUEST_EDIT'
    }

];