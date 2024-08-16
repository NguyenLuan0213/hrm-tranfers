import React from 'react';
import EmployeeList from './components/ListEmployees';
import UpdateEmployeeForm from './components/UpdateEmployeeForm';
import { Flex } from 'antd';

const NhanVienLayout: React.FC = () => {
    return (
        <div>
            <EmployeeList />
        </div>
    );
}

export default NhanVienLayout;
