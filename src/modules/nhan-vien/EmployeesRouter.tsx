import React from "react";
import { Route, Routes } from "react-router-dom";
import EmployeesLayout from "./EmployeesLayout";
import EmployeeDetail from "./components/DetailEmployee";

const NhanVienRouter: React.FC = () => {

    return (
        <Routes>
            <Route path="/" element={<EmployeesLayout />} />
            <Route path="/detail/:id" element={<EmployeeDetail />} />
        </Routes>
    );
}

export default NhanVienRouter;