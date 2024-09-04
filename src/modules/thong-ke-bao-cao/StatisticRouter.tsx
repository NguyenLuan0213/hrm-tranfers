import React from "react";
import { Route, Routes } from "react-router-dom";
import ChartStatistic from "./components/ChartStatistic";


const StatisticRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<ChartStatistic />} />
        </Routes>
    );
};

export default StatisticRouter;