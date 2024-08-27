import React from "react";
import { Route, Routes } from "react-router-dom";
import ListTransfersDecisions from "./components/ListTransfersDecisions";

const TransferDecisionsRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<ListTransfersDecisions />} />
        </Routes>
    );
};

export default TransferDecisionsRouter;