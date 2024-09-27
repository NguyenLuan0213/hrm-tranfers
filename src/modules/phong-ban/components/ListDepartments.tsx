import React, { useState, useEffect } from "react";
import { Departments} from "../data/department-data";
import { getDepartment } from "../services/department-services";
import { Flex, Table, Typography } from "antd";
import type { TableProps } from 'antd';

const { Title } = Typography;

type TablePagination<T extends object> = NonNullable<Exclude<TableProps<T>['pagination'], boolean>>;
type TablePaginationPosition = NonNullable<TablePagination<Departments>['position']>[number];


const ListDepartments: React.FC = () => {
    const [departments, setDepartments] = useState<Departments[]>([]);
    const [bottom, setBottom] = useState<TablePaginationPosition>('bottomCenter');

    useEffect(() => {
        getDepartment().then((res) => {
            setDepartments(res);
        });
    }, []);

    return (
        <Flex vertical style={{ padding: 10 }} >
            <Title level={2}>Danh sách phòng ban</Title>
            <Table dataSource={departments} rowKey="id" pagination={{ position: [bottom] }}>
                <Table.Column title="ID" dataIndex="id" key="id" />
                <Table.Column title="Tên phòng ban" dataIndex="name" key="name" />
                <Table.Column title="Địa chỉ" dataIndex="location" key="location" />
            </Table>
        </Flex>
    );
}

export default ListDepartments;