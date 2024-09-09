import { useState } from "react";
import { TransfersRequest } from "../data/transfer_request";
import { updateTransferRequest } from "../services/transfers_request_services";

export const useUpdateTransfersRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdate = async (id: number, values: TransfersRequest) => {
        setLoading(true);
        setError(null);
        try {
            await updateTransferRequest(id, values);
            setLoading(false);
            return true;
        } catch (error) {
            setError(error as string);
        } finally {
            setLoading(false);
        }
    };

    return {
        handleUpdate,
        loading,
        error,
    };
}