import React from "react";
import { Route, Routes } from "react-router-dom";
import TransferEmployees from "./components/ListTransfersRequest";

const TransfersRequestRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<TransferEmployees/>} />
        </Routes>
    );
};

export default TransfersRequestRouter;