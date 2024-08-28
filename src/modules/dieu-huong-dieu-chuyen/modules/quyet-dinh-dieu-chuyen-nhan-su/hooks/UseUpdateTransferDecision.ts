import { useState } from "react";
import { UpdateTransferDecision } from "../services/TransfersDecisionsService";
import { TransferDecision } from "../data/TransfersDecision";

export const UseUpdateTransferDecision = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdate = async (id: number, values: TransferDecision) => {
        setLoading(true);
        setError(null);
        try {
            await UpdateTransferDecision(id, values);
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