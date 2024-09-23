import React, { useEffect, useState } from "react";
import { Form, Button, Select, Input, message, Modal } from "antd";
//import dữ liệu
import { Departments } from "../../phong-ban/data/department_data";
import { TransfersRequest, TransferRequestStatus } from "../data/transfer_request";
//import services
import { addTransfersRequest } from "../services/transfers_request_services";
import { getDepartment } from "../../phong-ban/services/department_services";
//import hooks
import { useUserRole } from "../../../hooks/UserRoleContext";

interface AddTransfersRequestFormProps {
    onUpdate: (transfersRequest: TransfersRequest) => void;
    onCancel: () => void;
}

const AddTransfersRequestForm: React.FC<AddTransfersRequestFormProps> = ({ onUpdate, onCancel }) => {
    const [form] = Form.useForm<TransfersRequest>();
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
            departmentIdFrom: selectedDepartmentId || 0,
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
    const handleAddTransfersRequest = async (values: TransfersRequest) => {
        Modal.confirm({
            title: 'Xác nhận thêm yêu cầu điều chuyển',
            content: 'Bạn có chắc chắn muốn thêm yêu cầu điều chuyển này không?',
            async onOk() {
                const transfersRequest: TransfersRequest = {
                    ...values,
                    createdByEmployeeId: selectedId || 0, // Provide a default value of 0 if selectedId is undefined
                    departmentIdFrom: selectedDepartmentId || 0,
                    positionFrom: selectedRole || "",
                    status: TransferRequestStatus.DRAFT,
                    createdAt: new Date(),
                    updatedAt: null,
                };
                try {
                    const addedTransfersRequest = await addTransfersRequest(transfersRequest);
                    onUpdate(addedTransfersRequest);  // Chỉ gọi cập nhật sau khi thành công
                    message.success('Thêm yêu cầu điều chuyển mới thành công');
                } catch (error) {
                    message.error(`Thêm yêu cầu điều chuyển mới thất bại : ${error}`);
                }
            }
        });
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
                    Đồng ý
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={onCancel}>
                    Hủy bỏ
                </Button>
            </Form.Item>
        </Form>
    );
}

export default AddTransfersRequestForm;
