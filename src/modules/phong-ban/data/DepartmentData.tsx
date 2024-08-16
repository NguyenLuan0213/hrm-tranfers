export interface Departments{
    id: number;
    name: string;
    location: string;
}

let mockDepartments: Departments[] = [
    {
        id: 1,
        name: 'Phòng kế toán',
        location: 'Sài Gòn'
    },
    {
        id: 2,
        name: 'Phòng nhân sự',
        location: 'Sài Gòn'
    },
    {
        id: 3,
        name: 'Phòng kỹ thuật',
        location: 'Sài Gòn'
    },
    {
        id: 4,
        name: 'Phòng kế toán',
        location: 'Hà Nội'
    },
    {
        id: 5,
        name: 'Phòng nhân sự',
        location: 'Hà Nội'
    },
    {
        id: 6,
        name: 'Phòng kỹ thuật',
        location: 'Hà Nội'
    },
    {
        id: 7,
        name: 'Phòng giám đốc',
        location: 'Sài Gòn'
    },
    {
        id: 8,
        name: 'Phòng giám đốc',
        location: 'Hà Nội'
    }
];

export const getDepartment = async (): Promise<Departments[]> => {
    return mockDepartments;
}