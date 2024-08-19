import { useState } from "react";
import { Modal } from "antd";
import { DeleteTransferRequest } from "../data/TransfersRequest";

const { confirm } = Modal;

export const UseDeleteTransfersRequest = () => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async (id: number, onSuccess: () => void) => {
        confirm({
            title: 'Bạn có chắc muốn xóa yêu cầu điều chuyển này này?',
            onOk: async () => {
                setLoading(true);
                try {
                    await DeleteTransferRequest(id);
                    onSuccess();
                } catch (error) {
                    console.error("Error deleting transfer request:", error);
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    return { handleDelete, loading };
}