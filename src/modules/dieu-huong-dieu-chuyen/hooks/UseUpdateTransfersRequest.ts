import { useState } from "react";
import {  TransfersRequest } from "../data/TransfersRequest";
import { UpdateTransferRequest } from "../services/TransfersRequestServices";

export const UseUpdateTransfersRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdate = async (id: number, values: TransfersRequest) => {
        setLoading(true);
        setError(null);
        try {
            await UpdateTransferRequest(id, values);
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