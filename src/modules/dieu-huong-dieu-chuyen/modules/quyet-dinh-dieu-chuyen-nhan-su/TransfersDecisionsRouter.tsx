import React from "react";
import { Route, Routes } from "react-router-dom";
import ListTransfersDecisions from "./components/ListTransfersDecisions";
import DetailTransferDecision from "./components/DetailTransferDecision";

const TransferDecisionsRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<ListTransfersDecisions />} />
            <Route path="/detail/:id" element={<DetailTransferDecision />} />
        </Routes>
    );
};

export default TransferDecisionsRouter;