export enum ApprovalsAction {
    REQUEST_EDIT = 'REQUEST_EDIT',
    REJECT = 'REJECT',
    APPROVE = 'APPROVE',
    SUBMIT = 'SUBMIT',
    CANCEL = 'CANCEL'
}

export interface TransferDecisionApproval {
    id: number;
    decisionId: number | null;
    approverId: number | null;
    approvalDate?: Date | null;
    remarks?: string | null;
    approvalsAction: ApprovalsAction;
}

export let mockTransferDecisionApprovals: TransferDecisionApproval[] = [
    {
        id: 1,
        decisionId: 1,
        approverId: 1,
        approvalDate: new Date(),
        remarks: null,
        approvalsAction: ApprovalsAction.APPROVE
    },
    {
        id: 2,
        decisionId: 2,
        approverId: null,
        approvalDate: null,
        remarks: null,
        approvalsAction: ApprovalsAction.SUBMIT
    },
    {
        id: 3,
        decisionId: 3,
        approverId: 1,
        approvalDate: new Date(),
        remarks: null,
        approvalsAction: ApprovalsAction.REJECT
    },
    {
        id: 4,
        decisionId: 4,
        approverId: 1,
        approvalDate: new Date(),
        remarks: null,
        approvalsAction: ApprovalsAction.REQUEST_EDIT
    }

];