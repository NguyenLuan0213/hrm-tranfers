import React from "react";
import { Form, Button, Input, InputNumber, Select, DatePicker } from "antd";
import { TransfersRequest, addTransfersRequest } from "../data/TransfersRequest";

interface AddTransfersRequestFormProps {
    onUpdate: (transfersRequest: TransfersRequest) => void;
    onCancel: () => void;
}

const AddTransfersRequestForm: React.FC<AddTransfersRequestFormProps> = ({ onUpdate, onCancel }) => {
    const [form] = Form.useForm();

    const handleAddTransfersRequest = async (values: any) => {
        const transfersRequest: TransfersRequest = {
            ...values,
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
            <Form.Item label="Người tạo" name="createdByEmployeeId" rules={[{ required: true, message: 'Vui lòng nhập ID người tạo!' }]}>
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Người phê duyệt" name="approverId" rules={[{ required: true, message: 'Vui lòng nhập ID người phê duyệt!' }]}>
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Phòng ban từ" name="departmentIdFrom" rules={[{ required: true, message: 'Vui lòng nhập ID phòng ban từ!' }]}>
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Phòng ban đến" name="departmentIdTo" rules={[{ required: true, message: 'Vui lòng nhập ID phòng ban đến!' }]}>
                <InputNumber style={{ width: '100%' }} />
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
    );
}

export default AddTransfersRequestForm;