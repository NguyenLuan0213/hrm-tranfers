import { TransferDecision, mockTransDicisions } from "../data/TransfersDecision"

export const getTransfersDecisions = async (): Promise<TransferDecision[]> => {
    return mockTransDicisions;
};