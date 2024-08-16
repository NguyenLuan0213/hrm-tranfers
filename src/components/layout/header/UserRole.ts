export interface UserRoleProps {
    id: number;
    role: string;
    department: string;
}

let mockUserRole: UserRoleProps[] = [
    {
        id: 1,
        role: 'Employee',
        department: 'Phongketoan'
    },
    {
        id: 2,
        role: 'Employee',
        department: 'Phongnhansu'
    },
    {
        id: 3,
        role: 'Manager',
        department: 'Phongketoan'
    },
    {
        id: 4,
        role: 'Manager',
        department: 'Phongnhansu'
    },
    {
        id: 5,
        role: 'Directorate',
        department: 'BanGiamdoc'
    },
];

export const getUserRole = async (): Promise<UserRoleProps[]> => {
    return mockUserRole;
}