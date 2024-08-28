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
        approverId: 1,
        status: 'APPROVED',
        effectiveDate: new Date(),
        createdAt: new Date('2024-08-23T00:00:00Z'),
        updatedAt: new Date(),
    },
    {
        id: 2,
        requestId: 4,
        createdByEmployeeId: 17,
        approverId: null,
        status: 'PENDING',
        effectiveDate: null,
        createdAt: new Date('2024-08-23T00:00:00Z'),
        updatedAt: null,
    },
    {
        id: 3,
        requestId: 5,
        createdByEmployeeId: 17,
        approverId: null,
        status: 'DRAFT',
        effectiveDate: null,
        createdAt: new Date('2024-08-23T00:00:00Z'),
        updatedAt: null,
    }
];

