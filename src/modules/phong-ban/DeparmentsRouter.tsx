import React from "react";
import { Route, Routes } from "react-router-dom";
import DepartmentsLayout from "./DepartmentsLayout";

const DepartmentsRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<DepartmentsLayout/>} />
        </Routes>
    );
};

export default DepartmentsRouter;