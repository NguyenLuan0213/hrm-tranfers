import { useState, useEffect } from 'react';

const useUserRole = () => {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userDepartment, setUserDepartment] = useState<string | null>(null);
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const [canDelete, setCanDelete] = useState<boolean>(false);
    const [canSendRequest, setCanSendRequest] = useState<boolean>(false);
    const [canView, setCanView] = useState<boolean>(false);
    const [canApproveRequest, setCanApproveRequest] = useState<boolean>(false);
    const [canAdd, setCanAdd] = useState<boolean>(false);

    const updateCanEdit = (role: string | null) => {
        setCanEdit(role === "Employee");
    };

    const updateCanDelete = (role: string | null, departments: string | null) => {
        setCanDelete(role === "Employee" && departments === "Phongnhansu");
    };

    const updateCanSendRequest = (role: string | null) => {
        setCanSendRequest(role === "Employee" && userDepartment === "Phongketoan");
    }

    const updateCanView = (role: string | null, departments: string | null) => {
        setCanView(role === "Employee" ||
            role === "Manager" && departments === "Phongnhansu" ||
            role === "Directorate" && departments === "Bangiamdoc");
    }

    const updateCanApproveRequest = (role: string | null) => {
        setCanApproveRequest(role === "Manager");
    }

    const updateCanAdd = (role: string | null) => {
        setCanAdd(role === "Employee");
    }


    useEffect(() => {
        // Read from localStorage
        const storedRole = localStorage.getItem('userRole');
        const storedDepartment = localStorage.getItem('userDepartment');

        if (storedRole && storedDepartment) {
            setUserRole(storedRole);
            setUserDepartment(storedDepartment);
            console.log("có thay đổi");
            console.log(`Stored Role: ${storedRole} - ${storedDepartment}`);
            updateCanEdit(storedRole);
            updateCanDelete(storedRole, storedDepartment);
            updateCanSendRequest(storedRole);
            updateCanView(storedRole, storedDepartment);
            updateCanApproveRequest(storedRole);
            updateCanAdd(storedRole);
        }
    }, [userRole, userDepartment]);

    return {
        userRole,
        userDepartment,
        canEdit,
        canDelete,
        canSendRequest,
        canView,
        canApproveRequest,
        canAdd,
        setUserRole,
        setUserDepartment,
        updateCanEdit,
        updateCanDelete,
        updateCanSendRequest,
        updateCanView,
        updateCanApproveRequest,
        updateCanAdd
    };
};

export default useUserRole;
