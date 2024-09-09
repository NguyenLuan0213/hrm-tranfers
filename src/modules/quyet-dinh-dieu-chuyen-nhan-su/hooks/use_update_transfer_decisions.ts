import { useState } from "react";
import { updateTransferDecision } from "../services/transfer_decision_service";
import { TransferDecision } from "../data/transfer_decision";

export const useUpdateTransferDecision = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdate = async (id: number, values: TransferDecision) => {
        setLoading(true);
        setError(null);
        try {
            await updateTransferDecision(id, values);
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