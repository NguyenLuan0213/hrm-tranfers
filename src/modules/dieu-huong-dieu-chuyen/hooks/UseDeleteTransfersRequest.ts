import { useState } from "react";
import { Modal } from "antd";
import { DeleteTransferRequest } from "../services/TransfersRequestServices";

const { confirm } = Modal;

export const UseDeleteTransfersRequest = () => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async (id: number, onSuccess: () => void) => {
        confirm({
            title: 'Bạn có chắc muốn xóa hủy cầu điều chuyển này này?',
            onOk: async () => {
                setLoading(true);
                try {
                    await DeleteTransferRequest(id);
                    onSuccess();
                } catch (error) {
                    console.error("Lỗi!! Không thể hủy yêu cầu này:", error);
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    return { handleDelete, loading };
}