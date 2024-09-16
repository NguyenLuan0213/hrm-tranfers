import React from "react";
import { Route, Routes } from "react-router-dom";
import StatisticsOverTime from "./components/StatisticsOverTime";
import StatisticsByStatus from "./components/StatisticsByStatus";
import ReportPage from "./components/ReportPage";

const StatisticRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<StatisticsOverTime />} />
            <Route path="/status" element={<StatisticsByStatus />} />
            <Route path="/report" element={<ReportPage />} />
        </Routes>
    );
};

export default StatisticRouter;