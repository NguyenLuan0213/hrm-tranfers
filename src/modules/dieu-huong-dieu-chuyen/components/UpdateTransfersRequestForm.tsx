import React, { useEffect, useState } from "react";
import { Button, Input, Form, Select, message } from "antd";
import { TransfersRequest } from "../data/transfer_request";
import { Departments } from "../../phong-ban/data/department_data";
import { getDepartment } from "../../phong-ban/services/department_services";

interface UpdateTransferRequestFormProps {
    transfersRequest?: TransfersRequest | null,
    onUpdate: (updatedTransfersRequest: TransfersRequest) => void
    onCancel: () => void
}

const UpdateTransfersRequestForm: React.FC<UpdateTransferRequestFormProps> = ({ transfersRequest, onUpdate, onCancel }) => {
    const [form] = Form.useForm();
    const [departments, setDepartments] = useState<Departments[]>([]);

    //lấy danh sách phòng ban
    useEffect(() => {
        const fetchDepartments = async () => {
            const departmentsData = await getDepartment();
            setDepartments(departmentsData);
        };
        fetchDepartments();
    }, []);

    // Hiển thị dữ liệu cần update
    useEffect(() => {
        if (transfersRequest) {
            form.setFieldsValue({
                createdByEmployeeId: transfersRequest.createdByEmployeeId,
                approverId: transfersRequest.approverId,
                departmentIdFrom: transfersRequest.departmentIdFrom,
                departmentIdTo: transfersRequest.departmentIdTo,
                locationFrom: transfersRequest.locationFrom,
                locationTo: transfersRequest.locationTo,
                positionFrom: transfersRequest.positionFrom,
                positionTo: transfersRequest.positionTo,
            });
        }
    }, [transfersRequest, form]);

    //thay đổi tên phòng ban từ khi chọn id phòng ban từ
    const handleDepartmentFromChange = (value: number) => {
        const department = departments.find(dep => dep.id === value);
        if (department) {
            form.setFieldsValue({ locationFrom: department.location });
        }
    };

    //thay đổi tên phòng ban đến khi chọn id phòng ban đến
    const handleDepartmentToChange = (value: number) => {
        const department = departments.find(dep => dep.id === value);
        if (department) {
            form.setFieldsValue({ locationTo: department.location });
        }
    };

    //hàm cập nhật yêu cầu điều chuyển
    const handleSubmit = (values: any) => {
        if (transfersRequest) {
            const updatedTransfersRequest: TransfersRequest = {
                ...transfersRequest,
                ...values,
                createdByEmployeeId: transfersRequest.createdByEmployeeId,
                createdAt: transfersRequest.createdAt,
                updatedAt: transfersRequest.updatedAt,
                approverId: transfersRequest.approverId,
            };
            onUpdate(updatedTransfersRequest);
            message.success('Cập nhật thành công!');
        } else {
            message.error('Bản yêu cầu không tồn tại!');
        }
    };

    return (
        <div>
            <Form
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
                form={form}
                layout="horizontal"
                style={{ maxWidth: 900 }}
                onFinish={handleSubmit}
            >

                <Form.Item
                    label="Phòng ban từ"
                    name="departmentIdFrom"
                    rules={[
                        { required: true, message: 'Vui lòng nhập ID phòng ban từ!' }
                    ]}
                >
                    <Select
                        style={{ width: '100%' }}
                        onChange={handleDepartmentFromChange}
                    >
                        {departments.map(department => (
                            <Select.Option key={department.id} value={department.id}>
                                {`${department.name} (ID: ${department.id})`}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Phòng ban đến"
                    name="departmentIdTo"
                    rules={[
                        { required: true, message: 'Vui lòng nhập ID phòng ban đến!' }
                    ]}
                >
                    <Select
                        style={{ width: '100%' }}
                        onChange={handleDepartmentToChange}
                    >
                        {departments.map(department => (
                            <Select.Option key={department.id} value={department.id}>
                                {`${department.name} (ID: ${department.id})`}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Chức vụ từ" name="positionFrom" rules={[{ required: true, message: 'Vui lòng nhập chức vụ từ!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Chức vụ đến" name="positionTo" rules={[{ required: true, message: 'Vui lòng nhập chức vụ đến!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Địa điểm từ" name="locationFrom" rules={[{ required: true, message: 'Vui lòng nhập địa điểm từ!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Địa điểm đến" name="locationTo" rules={[{ required: true, message: 'Vui lòng nhập địa điểm đến!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={onCancel}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default UpdateTransfersRequestForm;
