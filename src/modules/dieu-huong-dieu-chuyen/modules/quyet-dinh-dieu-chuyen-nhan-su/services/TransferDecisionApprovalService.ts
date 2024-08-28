import { TransferDecisionApproval, mockTransferDecisionApprovals } from '../data/TransferDecisionApprovals';

export const getTransferDecisionApprovals = async (): Promise<TransferDecisionApproval[]> => {
    return mockTransferDecisionApprovals;
}

export const addTransferDecisionApproval = async (transferDecisionApproval: TransferDecisionApproval): Promise<TransferDecisionApproval> => {
    const newTransferDecisionApproval = { ...transferDecisionApproval, id: mockTransferDecisionApprovals.length + 1 };
    mockTransferDecisionApprovals.push(newTransferDecisionApproval);
    return newTransferDecisionApproval;
}

export const getLengthTransferDecisionApprovals = async (): Promise<number> => {
    return mockTransferDecisionApprovals.length;
}

export const getTransferDecisionApprovalById = async (id: number): Promise<TransferDecisionApproval> => {
    return mockTransferDecisionApprovals.find(td => td.id === id)!;
}

export const getTransferDecisionApprovalsByDecisionId = async (decisionId: number): Promise<TransferDecisionApproval | null> => {
    const result = mockTransferDecisionApprovals.find(td => td.decisionId === decisionId);
    return result || null;
}
