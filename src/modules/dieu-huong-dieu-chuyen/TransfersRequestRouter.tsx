import React from "react";
import { Route, Routes } from "react-router-dom";
import TransferEmployees from "./components/ListTransfersRequest";
import DetailTransfersResquest from "./components/DetailTransfersResquest";

const TransfersRequestRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<TransferEmployees />} />
            <Route path="/detail/:id" element={<DetailTransfersResquest />} />
        </Routes>
    );
};

export default TransfersRequestRouter;