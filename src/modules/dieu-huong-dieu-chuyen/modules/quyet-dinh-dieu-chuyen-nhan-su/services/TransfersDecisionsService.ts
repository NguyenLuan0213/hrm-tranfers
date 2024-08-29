import { TransferDecision, mockTransDecisions } from "../data/TransfersDecision"
import { mockEmployees } from "../../../../nhan-vien/data/EmployeesData"
import { updateEmployee } from "../../../../nhan-vien/services/EmployeeServices"
import { mockTransfersRequest } from "../../../data/TransfersRequest"

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

export const UpdateTransferDecision = async (id: number, transferDecision: TransferDecision): Promise<TransferDecision | undefined> => {
    const existingDecision = mockTransDecisions.find(td => td.requestId === transferDecision.requestId &&
        !['APPROVED', 'REJECTED', 'CANCELLED'].includes(td.status));

    if (existingDecision) {
        throw new Error('Đã có một quyết định đang xử lý cho yêu cầu này');
    }

    const index = mockTransDecisions.findIndex(td => td.id === id);
    if (index !== -1) {
        mockTransDecisions[index] = { ...transferDecision };
        return mockTransDecisions[index];
    }
    return undefined;
};

export const cancelTransferDecision = async (id: number): Promise<void> => {
    const index = mockTransDecisions.findIndex(td => td.id === id);
    if (index !== -1) {
        mockTransDecisions[index].status = 'CANCELLED';
    }
};

export const sendTransferDecision = async (id: number): Promise<void> => {
    const index = mockTransDecisions.findIndex(td => td.id === id);
    if (index !== -1) {
        mockTransDecisions[index].status = 'PENDING';
    }
}

export const updateApproveTransferDecision = async (id: number, transferDecision: TransferDecision): Promise<TransferDecision | undefined> => {
    const index = mockTransDecisions.findIndex(td => td.id === id);
    if (index !== -1) {
        mockTransDecisions[index] = { ...transferDecision };
        return mockTransDecisions[index];
    }
    return undefined;
}

export const updateEmployeeAlterApproval = async (id: number): Promise<void> => {
    const transferRequest = mockTransfersRequest.findIndex(tr => tr.id === id);
    if (transferRequest !== -1) {
        const employee = mockEmployees.find(e => e.id === mockTransfersRequest[transferRequest].createdByEmployeeId);
        if (employee) {
            employee.idDepartment = mockTransfersRequest[transferRequest].departmentIdTo;
            employee.role = mockTransfersRequest[transferRequest].positionTo;
            updateEmployee(employee.id, employee);
        } else {
            throw new Error('Không tìm thấy nhân viên');
        }
    } else {
        throw new Error('Không tìm thấy yêu cầu');
    }
}
