export interface TransferDecision {
    id: number;
    requestId: number | null;
    createdByEmployeeId: number | null;
    approverId?: number | null;
    status: string | 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    effectiveDate?: Date | null;
    createdAt: Date;
    updatedAt: Date | null;
}

export let mockTransDecisions: TransferDecision[] = [
    {
        id: 1,
        requestId: 1,
        createdByEmployeeId: 17,
        approverId: null,
        status: 'APPROVED',
        effectiveDate: null,
        createdAt: new Date('2024-08-23T00:00:00Z'),
        updatedAt: null,
    }
];

