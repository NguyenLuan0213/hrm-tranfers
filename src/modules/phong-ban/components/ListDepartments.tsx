import React, { useState, useEffect } from "react";
import { Departments, getDepartment } from "../data/DepartmentData";
import { Flex, Table } from "antd";
import type { TableProps } from 'antd';


type TablePagination<T extends object> = NonNullable<Exclude<TableProps<T>['pagination'], boolean>>;
type TablePaginationPosition = NonNullable<TablePagination<any>['position']>[number];


const ListDepartments: React.FC = () => {
    const [departments, setDepartments] = useState<Departments[]>([]);
    const [bottom, setBottom] = useState<TablePaginationPosition>('bottomCenter');

    useEffect(() => {
        getDepartment().then((res) => {
            setDepartments(res);
            console.log(departments);
        });
    }, []);

    return (
        <Flex vertical style={{ padding: 10 }} >
            <h1>Danh sách phòng ban</h1>
            <Table dataSource={departments} rowKey="id" pagination={{ position: [bottom] }}>
                <Table.Column title="ID" dataIndex="id" key="id" />
                <Table.Column title="Tên phòng ban" dataIndex="name" key="name" />
                <Table.Column title="Địa chỉ" dataIndex="location" key="location" />
            </Table>
        </Flex>
    );
}

export default ListDepartments;