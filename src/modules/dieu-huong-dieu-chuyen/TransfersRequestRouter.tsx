import React from "react";
import { Route, Routes } from "react-router-dom";
import TransferEmployees from "./components/ListTransfersRequest";
import DetailTransfersResquest from "./components/DetailTransfersResquest";
import TransferDecisionsRouter from "../quyet-dinh-dieu-chuyen-nhan-su/TransfersDecisionsRouter";

const TransfersRequestRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<TransferEmployees />} />
            <Route path="/detail/:id" element={<DetailTransfersResquest />} />
            <Route path="/decisions/*" element={<TransferDecisionsRouter />} />
        </Routes>
    );
};

export default TransfersRequestRouter;