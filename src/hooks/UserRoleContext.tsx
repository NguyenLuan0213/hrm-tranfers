import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserRoleContextProps {
    selectedRole: string | undefined;
    selectedDepartment: string | undefined;
    setSelectedRole: (role: string | undefined) => void;
    setSelectedDepartment: (department: string | undefined) => void;
}

const UserRoleContext = createContext<UserRoleContextProps | undefined>(undefined);

export const useUserRole = () => {
    const context = useContext(UserRoleContext);
    if (!context) {
        throw new Error('useUserRole must be used within a UserRoleProvider');
    }
    return context;
};

export const UserRoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
    const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);

    return (
        <UserRoleContext.Provider value={{ selectedRole, selectedDepartment, setSelectedRole, setSelectedDepartment }}>
            {children}
        </UserRoleContext.Provider>
    );
};
