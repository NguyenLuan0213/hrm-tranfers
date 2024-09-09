import React, { useEffect, useState } from "react";
import { Form, Button, Select, Input } from "antd";
import { TransfersRequest } from "../data/transfer_request";
import { addTransfersRequest } from "../services/transfers_request_services";
import { useUserRole } from "../../../hooks/UserRoleContext";
import { Departments } from "../../phong-ban/data/department_data";
import { getDepartment } from "../../phong-ban/services/department_services";

interface AddTransfersRequestFormProps {
    onUpdate: (transfersRequest: TransfersRequest) => void;
    onCancel: () => void;
}

const addTransfersRequestForm: React.FC<AddTransfersRequestFormProps> = ({ onUpdate, onCancel }) => {
    const [form] = Form.useForm();
    const { selectedId, selectedRole, selectedDepartmentId } = useUserRole();
    const [departments, setDepartments] = useState<Departments[]>([]);
    const [locationTo, setLocationTo] = useState<string>("");

    // Lấy danh sách phòng ban
    useEffect(() => {
        const fetchDepartments = async () => {
            const departments = await getDepartment();
            setDepartments(departments);
        };
        fetchDepartments();
    }, []);

    // Hiển thị dữ liệu cần update
    useEffect(() => {
        form.setFieldsValue({
            departmentIdFrom: selectedDepartmentId,
            positionFrom: selectedRole,
            locationFrom: departments.find(department => department.id === selectedDepartmentId)?.location,
        });
    }, [selectedRole, selectedDepartmentId, departments, form]);

    // Xử lý khi chọn phòng ban đến
    const handleDepartmentToChange = (value: number) => {
        const department = departments.find(department => department.id === value);
        const newLocationTo = department ? department.location : "";
        setLocationTo(newLocationTo);
        form.setFieldsValue({ locationTo: newLocationTo });
    };

    // Hàm thêm yêu cầu điều chuyển
    const handleAddTransfersRequest = async (values: any) => {
        const transfersRequest: TransfersRequest = {
            ...values,
            createdByEmployeeId: selectedId,
            departmentIdFrom: selectedDepartmentId,
            positionFrom: selectedRole,
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: null,
        };
        try {
            const addedTransfersRequest = await addTransfersRequest(transfersRequest);
            onUpdate(addedTransfersRequest);  // Chỉ gọi cập nhật sau khi thành công
            alert('Thêm yêu cầu điều chuyển mới thành công');
        } catch (error) {
            console.error('Thêm yêu cầu điều chuyển mới thất bại:', error);
            alert('Thêm yêu cầu điều chuyển mới thất bại');
        }
    };

    return (
        <Form
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
            form={form}
            layout="horizontal"
            style={{ maxWidth: 900 }}
            onFinish={handleAddTransfersRequest}
        >

            <Form.Item
                label="Phòng ban từ"
                name="departmentIdFrom"
                rules={[
                    { required: true, message: 'Vui lòng nhập ID phòng ban từ!' },
                ]}
            >
                <Select style={{ width: '100%' }}>
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
                    { required: true, message: 'Vui lòng nhập ID phòng ban đến!' },
                ]}
            >
                <Select style={{ width: '100%' }} onChange={handleDepartmentToChange}>
                    {departments.map(department => (
                        <Select.Option key={department.id} value={department.id}>
                            {`${department.name} (ID: ${department.id})`}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item label="Chức vụ từ" name="positionFrom" rules={[{ required: true, message: 'Vui lòng nhập chức vụ từ!' }]}>
                <Input value={selectedRole} />
            </Form.Item>

            <Form.Item label="Chức vụ đến" name="positionTo" rules={[{ required: true, message: 'Vui lòng nhập chức vụ đến!' }]}>
                <Input />
            </Form.Item>

            <Form.Item label="Địa điểm từ" name="locationFrom" rules={[{ required: true, message: 'Vui lòng nhập địa điểm từ!' }]}>
                <Input />
            </Form.Item>

            <Form.Item label="Địa điểm đến" name="locationTo" rules={[{ required: true, message: 'Vui lòng nhập địa điểm đến!' }]}>
                <Input value={locationTo} />
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
    );
}

export default addTransfersRequestForm;
