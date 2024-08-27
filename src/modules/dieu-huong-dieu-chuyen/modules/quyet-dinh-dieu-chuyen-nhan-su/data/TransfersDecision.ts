export interface TransferDecision {
    id: number;
    requestId: number;
    createdByEmployeeId: number| null;
    approverId?: number | null;
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    effectiveDate?: Date | null;
    createdAt: Date;
    updatedAt: Date | null;
}

export let mockTransDicisions: TransferDecision[] = [
    {
        id: 1,
        requestId: 1,
        createdByEmployeeId: null,
        approverId: null,
        status: 'DRAFT',
        effectiveDate: null,
        createdAt: new Date(),
        updatedAt: null,
    }
];

