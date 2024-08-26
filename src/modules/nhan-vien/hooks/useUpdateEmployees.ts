import { useState } from "react";
import { Employee } from "../data/EmployeesData";
import { updateEmployee } from "../services/EmployeeServices";
export const useUpdateEmployee = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdate = async (employeeId: number, updatedEmployee: Employee) => {
        setLoading(true);
        setError(null);
        try {
            await updateEmployee(employeeId, updatedEmployee);
            setLoading(false);
            return true;
        } catch (error) {
            setError('Failed to update employee');
            setLoading(false);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        handleUpdate,
        error
    };
};