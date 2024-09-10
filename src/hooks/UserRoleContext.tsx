import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserRoleContextProps {
    selectedRole: string | undefined;
    selectedDepartment: string | undefined;
    selectedName: string | undefined;
    selectedId: number | undefined;
    selectedDepartmentId: number | undefined;
    setSelectedRole: (role: string | undefined) => void;
    setSelectedDepartment: (department: string | undefined) => void;
    setSelectedName: (name: string | undefined) => void;
    setSelectedId: (id: number | undefined) => void;
    setSelectedDepartmentId: (departmentId: number | undefined) => void;
}

const UserRoleContext = createContext<UserRoleContextProps | undefined>(undefined);

export const useUserRole = () => {
    const context = useContext(UserRoleContext);
    if (!context) {
        throw new Error('useUserRole phải được sử dụng trong UserRoleProvider');
    }
    return context;
};

export const UserRoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
    const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
    const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | undefined>(undefined);

    return (
        <UserRoleContext.Provider value={{
            selectedRole,
            selectedDepartment,
            selectedName,
            selectedId,
            selectedDepartmentId,
            setSelectedRole,
            setSelectedDepartment,
            setSelectedName,
            setSelectedId,
            setSelectedDepartmentId
        }}>
            {children}
        </UserRoleContext.Provider>
    );
};
