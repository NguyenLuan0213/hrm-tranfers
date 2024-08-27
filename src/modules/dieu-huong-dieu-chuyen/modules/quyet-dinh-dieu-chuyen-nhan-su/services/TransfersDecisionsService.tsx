import { TransferDecision, mockTransDicisions } from "../data/TransfersDecision"

export const getTransfersDecisions = async (): Promise<TransferDecision[]> => {
    return mockTransDicisions;
};

export const addTransferDecision = async (transferDecision: TransferDecision): Promise<TransferDecision> => {
    const existingDecision = mockTransDicisions.find(td => td.requestId === transferDecision.requestId &&
        !['APPROVED', 'REJECTED', 'CANCELLED'].includes(td.status));

    if (existingDecision) {
        throw new Error('Đã tồn tại quyết định điều chuyển cho yêu cầu này');
    }

    const newTransferDecision = { ...transferDecision, id: mockTransDicisions.length + 1 };
    mockTransDicisions.push(newTransferDecision);
    return newTransferDecision;
}

export const getLengthTransfersDecisions = async (): Promise<number> => {
    return mockTransDicisions.length;
}