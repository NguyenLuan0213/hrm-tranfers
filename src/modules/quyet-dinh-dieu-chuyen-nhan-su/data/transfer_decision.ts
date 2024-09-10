export enum TransferDecisionStatus {
    DRAFT = 'DRAFT',
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
    EDITING = 'EDITING',
}

export interface TransferDecision {
    id: number;
    requestId: number | null;
    createdByEmployeeId: number | null;
    approverId?: number | null;
    status: TransferDecisionStatus;
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
        status: TransferDecisionStatus.APPROVED,
        effectiveDate: new Date(),
        createdAt: new Date('2024-08-23T00:00:00Z'),
        updatedAt: new Date(),
    },
    {
        id: 2,
        requestId: 4,
        createdByEmployeeId: 17,
        approverId: null,
        status: TransferDecisionStatus.PENDING,
        effectiveDate: null,
        createdAt: new Date('2024-08-23T00:00:00Z'),
        updatedAt: new Date(),
    },
    {
        id: 3,
        requestId: 5,
        createdByEmployeeId: 17,
        approverId: 1,
        status: TransferDecisionStatus.REJECTED,
        effectiveDate: null,
        createdAt: new Date('2024-08-23T00:00:00Z'),
        updatedAt: new Date(),
    },
    {
        id: 4,
        requestId: 6,
        createdByEmployeeId: 17,
        approverId: null,
        status: TransferDecisionStatus.EDITING,
        effectiveDate: null,
        createdAt: new Date('2024-08-23T00:00:00Z'),
        updatedAt: new Date(),
    },
    {
        id: 5,
        requestId: 7,
        createdByEmployeeId: 17,
        approverId: null,
        status: TransferDecisionStatus.DRAFT,
        effectiveDate: null,
        createdAt: new Date('2024-08-23T00:00:00Z'),
        updatedAt: null,
    }
];

