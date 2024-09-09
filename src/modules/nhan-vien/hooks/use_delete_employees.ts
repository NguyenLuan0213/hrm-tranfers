import { useState } from "react";
import { Modal } from "antd";
import { deleteEmployee } from "../services/employee_services";
const { confirm } = Modal;

export const useDeleteEmployee = () => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async (id: number, onSuccess: () => void) => {
        confirm({
            title: 'Bạn có chắc muốn xóa nhân viên này?',
            onOk: async () => {
                setLoading(true);
                try {
                    await deleteEmployee(id);
                    onSuccess();
                } catch (error) {
                    console.error("Error deleting employee:", error);
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    return { handleDelete, loading };
};
