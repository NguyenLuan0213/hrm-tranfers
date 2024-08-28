import { TransferDecision, mockTransDecisions } from "../data/TransfersDecision"

export const getTransfersDecisions = async (): Promise<TransferDecision[]> => {
    return mockTransDecisions;
};

export const addTransferDecision = async (transferDecision: TransferDecision): Promise<TransferDecision> => {
    const existingDecision = mockTransDecisions.find(td => td.requestId === transferDecision.requestId &&
        !['APPROVED', 'REJECTED', 'CANCELLED'].includes(td.status));

    if (existingDecision) {
        throw new Error('Đã tồn tại quyết định điều chuyển cho yêu cầu này');
    }

    const newTransferDecision = { ...transferDecision, id: mockTransDecisions.length + 1 };
    mockTransDecisions.push(newTransferDecision);
    return newTransferDecision;
}

export const getLengthTransfersDecisions = async (): Promise<number> => {
    return mockTransDecisions.length;
}

export const getTransferDecisionById = async (id: number): Promise<TransferDecision> => {
    return mockTransDecisions.find(td => td.id === id)!;
}