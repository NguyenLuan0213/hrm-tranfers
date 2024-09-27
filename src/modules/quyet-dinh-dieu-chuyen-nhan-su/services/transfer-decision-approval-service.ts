import { TransferDecisionApproval, mockTransferDecisionApprovals, ApprovalsAction } from '../data/transfer-decision-approvals';

export interface HistoryTransferDecisionApproval extends TransferDecisionApproval {
    primaryId?: number;
    id: number;
    decisionId: number | null;
    approverId: number | null;
    approvalDate?: Date | null;
    remarks?: string | null;
    approvalsAction: ApprovalsAction;
}

//lấy danh sách duyệt quyết định điều chuyển
export const getTransferDecisionApprovals = async (): Promise<TransferDecisionApproval[]> => {
    return mockTransferDecisionApprovals;
}

//thêm duyệt quyết định điều chuyển
export const addTransferDecisionApproval = async (transferDecisionApproval: TransferDecisionApproval): Promise<TransferDecisionApproval> => {
    const newTransferDecisionApproval = { ...transferDecisionApproval, id: mockTransferDecisionApprovals.length + 1 };
    mockTransferDecisionApprovals.push(newTransferDecisionApproval);
    return newTransferDecisionApproval;
}

//Lấy số lượng đơn duyệt quyết định điều chuyển
export const getLengthTransferDecisionApprovals = async (): Promise<number> => {
    return mockTransferDecisionApprovals.length;
}

//lấy duyệt quyết định điều chuyển theo id
export const getTransferDecisionApprovalById = async (id: number): Promise<TransferDecisionApproval> => {
    return mockTransferDecisionApprovals.find(td => td.id === id)!;
}

//lấy duyệt quyết định điều chuyển theo id quyết định
export const getTransferDecisionApprovalsByDecisionId = async (decisionId: number): Promise<TransferDecisionApproval | null> => {
    const result = mockTransferDecisionApprovals.find(td => td.decisionId === decisionId);
    return result || null;
}

//cập nhật duyệt quyết định điều chuyển
export const updateTransferDecisionApproval = async (id: number, transferDecisionApproval: TransferDecisionApproval): Promise<TransferDecisionApproval | null> => {
    const index = mockTransferDecisionApprovals.findIndex(td => td.id === id);
    if (index !== -1) {
        mockTransferDecisionApprovals[index] = { ...transferDecisionApproval };
        return mockTransferDecisionApprovals[index];
    }
    return null;
};

//Lấy lịch sử danh sách đơn duyệt quyết định điều chuyển theo
export const getHistoryTransferDecisionApprovals = async (decisionId: number): Promise<HistoryTransferDecisionApproval[]> => {
    let history: HistoryTransferDecisionApproval[] = mockTransferDecisionApprovals
        .filter(item => item.decisionId === decisionId)
        .sort((a, b) => (a.decisionId ?? 0) - (b.decisionId ?? 0))
        .map((item, index) => ({ ...item, primaryId: index + 1 })); // Thêm primaryId
    return history;
}
