export interface TransfersRequest {
    id: number;
    createdByEmployeeId: number;
    approverId: number | null;
    departmentIdFrom: number;
    departmentIdTo: number;
    positionFrom: string;
    positionTo: string;
    locationFrom: string;
    locationTo: string;
    status: 'DRAFT' | 'PENDING' | 'EDITING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    createdAt: Date;
    updatedAt: Date | null;
}

export let mockTransfersRequest: TransfersRequest[] = [
    {
        id: 1,
        createdByEmployeeId: 10,
        approverId: null,
        departmentIdFrom: 1,
        departmentIdTo: 2,
        positionFrom: 'Nhân viên',
        positionTo: 'Trưởng phòng',
        locationFrom: 'Hà Nội',
        locationTo: 'Hồ Chí Minh',
        status: 'APPROVED',
        createdAt: new Date('2021-09-01'),
        updatedAt: new Date('2021-09-11'),
    },
    {
        id: 2,
        createdByEmployeeId: 11,
        approverId: null,
        departmentIdFrom: 1,
        departmentIdTo: 1,
        positionFrom: 'Trưởng phòng',
        positionTo: 'Nhân viên',
        locationFrom: 'Hồ Chí Minh',
        locationTo: 'Hà Nội',
        status: 'PENDING',
        createdAt: new Date('2021-09-02'),
        updatedAt: null,
    },
    {
        id: 3,
        createdByEmployeeId: 12,
        approverId: null,
        departmentIdFrom: 1,
        departmentIdTo: 2,
        positionFrom: 'Trưởng phòng',
        positionTo: 'Nhân viên',
        locationFrom: 'Hồ Chí Minh',
        locationTo: 'Hà Nội',
        status: 'DRAFT',
        createdAt: new Date('2021-09-03'),
        updatedAt: null,
    },
    {
        id: 4,
        createdByEmployeeId: 13,
        approverId: 4,
        departmentIdFrom: 1,
        departmentIdTo: 4,
        positionFrom: 'Nhân viên',
        positionTo: 'Trưởng phòng',
        locationFrom: 'Hồ Chí Minh',
        locationTo: 'Hà Nội',
        status: 'APPROVED',
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2022-01-11'),
    },
    {
        id: 5,
        createdByEmployeeId: 14,
        approverId: 5,
        departmentIdFrom: 2,
        departmentIdTo: 5,
        positionFrom: 'Nhân viên',
        positionTo: 'Trưởng phòng',
        locationFrom: 'Hồ Chí Minh',
        locationTo: 'Hà Nội',
        status: 'APPROVED',
        createdAt: new Date('2022-02-01'),
        updatedAt: new Date('2022-02-11'),
    },
    {
        id: 6,
        createdByEmployeeId: 15,
        approverId: 5,
        departmentIdFrom: 2,
        departmentIdTo: 6,
        positionFrom: 'Nhân viên',
        positionTo: 'Trưởng phòng',
        locationFrom: 'Hồ Chí Minh',
        locationTo: 'Hà Nội',
        status: 'APPROVED',
        createdAt: new Date('2022-03-01'),
        updatedAt: new Date('2022-03-11'),
    },
    {
        id: 7,
        createdByEmployeeId: 16,
        approverId: 5,
        departmentIdFrom: 2,
        departmentIdTo: 1,
        positionFrom: 'Nhân viên',
        positionTo: 'Trưởng phòng',
        locationFrom: 'Hà Nội',
        locationTo: 'Hồ Chí Minh',
        status: 'APPROVED',
        createdAt: new Date('2022-04-01'),
        updatedAt: new Date('2022-04-11'),
    },
    {
        id: 8,
        createdByEmployeeId: 17,
        approverId: 5,
        departmentIdFrom: 2,
        departmentIdTo: 2,
        positionFrom: 'Nhân viên',
        positionTo: 'Trưởng phòng',
        locationFrom: 'Hà Nội',
        locationTo: 'Hồ Chí Minh',
        status: 'APPROVED',
        createdAt: new Date('2022-05-01'),
        updatedAt: new Date('2022-05-11'),
    },
    {
        id: 9,
        createdByEmployeeId: 18,
        approverId: 6,
        departmentIdFrom: 3,
        departmentIdTo: 3,
        positionFrom: 'Nhân viên',
        positionTo: 'Trưởng phòng',
        locationFrom: 'Hà Nội',
        locationTo: 'Hồ Chí Minh',
        status: 'APPROVED',
        createdAt: new Date('2022-06-01'),
        updatedAt: new Date('2022-06-11'),
    },
    {
        id: 10,
        createdByEmployeeId: 19,
        approverId: 6,
        departmentIdFrom: 3,
        departmentIdTo: 6,
        positionFrom: 'Nhân viên',
        positionTo: 'Trưởng phòng',
        locationFrom: 'Hồ Chí Minh',
        locationTo: 'Hà Nội',
        status: 'APPROVED',
        createdAt: new Date('2022-07-01'),
        updatedAt: new Date('2022-07-11'),
    },
    {
        id: 11,
        createdByEmployeeId: 20,
        approverId: 6,
        departmentIdFrom: 3,
        departmentIdTo: 5,
        positionFrom: 'Trưởng phòng',
        positionTo: 'Nhân viên',
        locationFrom: 'Hà Nội',
        locationTo: 'Hồ Chí Minh',
        status: 'APPROVED',
        createdAt: new Date('2022-08-01'),
        updatedAt: new Date('2022-08-11'),
    },
    {
        id: 12,
        createdByEmployeeId: 21,
        approverId: 6,
        departmentIdFrom: 3,
        departmentIdTo: 6,
        positionFrom: 'Nhân viên',
        positionTo: 'Trưởng phòng',
        locationFrom: 'Hồ Chí Minh',
        locationTo: 'Hà Nội',
        status: 'APPROVED',
        createdAt: new Date('2022-09-01'),
        updatedAt: new Date('2022-09-11'),
    },
    {
        id: 13,
        createdByEmployeeId: 22,
        approverId: 7,
        departmentIdFrom: 4,
        departmentIdTo: 3,
        positionFrom: 'Nhân viên',
        positionTo: 'Nhân viên',
        locationFrom: 'Hà Nội',
        locationTo: 'Hồ Chí Minh',
        status: 'APPROVED',
        createdAt: new Date('2022-10-01'),
        updatedAt: new Date('2022-10-11'),
    },
    {
        id: 14,
        createdByEmployeeId: 23,
        approverId: 7,
        departmentIdFrom: 4,
        departmentIdTo: 1,
        positionFrom: 'Trưởng phòng',
        positionTo: 'Nhân viên',
        locationFrom: 'Hà Nội',
        locationTo: 'Hồ Chí Minh',
        status: 'APPROVED',
        createdAt: new Date('2022-11-01'),
        updatedAt: new Date('2022-11-11'),
    },
    {
        id: 15,
        createdByEmployeeId: 24,
        approverId: 7,
        departmentIdFrom: 4,
        departmentIdTo: 5,
        positionFrom: 'Trưởng phòng',
        positionTo: 'Nhân viên',
        locationFrom: 'Hồ Chí Minh',
        locationTo: 'Hà Nội',
        status: 'APPROVED',
        createdAt: new Date('2022-12-01'),
        updatedAt: new Date('2022-12-11'),
    },
    {
        id: 16,
        createdByEmployeeId: 25,
        approverId: 7,
        departmentIdFrom: 4,
        departmentIdTo: 4,
        positionFrom: 'Nhân viên',
        positionTo: 'Trưởng phòng',
        locationFrom: 'Hồ Chí Minh',
        locationTo: 'Hà Nội',
        status: 'APPROVED',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-11'),
    },
    {
        id: 17,
        createdByEmployeeId: 26,
        approverId: 8,
        departmentIdFrom: 5,
        departmentIdTo: 1,
        positionFrom: 'Trưởng phòng',
        positionTo: 'Nhân viên',
        locationFrom: 'Hồ Chí Minh',
        locationTo: 'Hà Nội',
        status: 'APPROVED',
        createdAt: new Date('2023-02-01'),
        updatedAt: new Date('2023-02-11'),
    },
    {
        id: 18,
        createdByEmployeeId: 27,
        approverId: 8,
        departmentIdFrom: 5,
        departmentIdTo: 2,
        positionFrom: 'Nhân viên',
        positionTo: 'Trưởng phòng',
        locationFrom: 'Hồ Chí Minh',
        locationTo: 'Hà Nội',
        status: 'APPROVED',
        createdAt: new Date('2023-03-01'),
        updatedAt: new Date('2023-03-11'),
    },
    {
        id: 19,
        createdByEmployeeId: 28,
        approverId: 8,
        departmentIdFrom: 5,
        departmentIdTo: 3,
        positionFrom: 'Trưởng phòng',
        positionTo: 'Nhân viên',
        locationFrom: 'Hồ Chí Minh',
        locationTo: 'Hà Nội',
        status: 'APPROVED',
        createdAt: new Date('2023-04-01'),
        updatedAt: new Date('2023-04-11'),
    },
    {
        id: 20,
        createdByEmployeeId: 29,
        approverId: 8,
        departmentIdFrom: 5,
        departmentIdTo: 1,
        positionFrom: 'Nhân viên',
        positionTo: 'Trưởng phòng',
        locationFrom: 'Hồ Chí Minh',
        locationTo: 'Hà Nội',
        status: 'APPROVED',
        createdAt: new Date('2023-05-01'),
        updatedAt: new Date('2023-05-11'),
    },
    {
        id: 21,
        createdByEmployeeId: 30,
        approverId: 9,
        departmentIdFrom: 6,
        departmentIdTo: 6,
        positionFrom: 'Nhân viên',
        positionTo: 'Trưởng phòng',
        locationFrom: 'Hà Nội',
        locationTo: 'Hồ Chí Minh',
        status: 'APPROVED',
        createdAt: new Date('2023-06-01'),
        updatedAt: new Date('2023-06-11'),
    },
    {
        id: 22,
        createdByEmployeeId: 31,
        approverId: 9,
        departmentIdFrom: 6,
        departmentIdTo: 5,
        positionFrom: 'Nhân viên',
        positionTo: 'Trưởng phòng',
        locationFrom: 'Hà Nội',
        locationTo: 'Hồ Chí Minh',
        status: 'APPROVED',
        createdAt: new Date('2023-07-01'),
        updatedAt: new Date('2023-07-11'),
    },
    {
        id: 23,
        createdByEmployeeId: 32,
        approverId: 9,
        departmentIdFrom: 6,
        departmentIdTo: 4,
        positionFrom: 'Trưởng phòng',
        positionTo: 'Nhân viên',
        locationFrom: 'Hà Nội',
        locationTo: 'Hồ Chí Minh',
        status: 'APPROVED',
        createdAt: new Date('2023-08-01'),
        updatedAt: new Date('2023-08-11'),
    },
    {
        id: 24,
        createdByEmployeeId: 33,
        approverId: null,
        departmentIdFrom: 6,
        departmentIdTo: 3,
        positionFrom: 'Nhân viên',
        positionTo: 'Trưởng phòng',
        locationFrom: 'Hà Nội',
        locationTo: 'Hồ Chí Minh',
        status: 'DRAFT',
        createdAt: new Date('2023-09-01'),
        updatedAt: new Date('2023-09-11'),
    },
];
