import { useState } from "react";
import { message, Modal } from "antd";
import { deleteTransferRequest } from "../services/transfers_request_services";

const { confirm } = Modal;

export const useDeleteTransfersRequest = () => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async (id: number, onSuccess: () => void) => {
        confirm({
            title: 'Bạn có chắc muốn xóa hủy cầu điều chuyển này?',
            onOk: async () => {
                setLoading(true);
                try {
                    await deleteTransferRequest(id);
                    onSuccess();
                } catch (error) {
                    message.error(`Lỗi!! Không thể hủy yêu cầu này: ${(error as Error).message}`);
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    return { handleDelete, loading };
}