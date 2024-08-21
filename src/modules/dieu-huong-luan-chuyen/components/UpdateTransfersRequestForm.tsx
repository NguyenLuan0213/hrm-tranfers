import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Button, Input, Typography, Form, InputNumber, message} from "antd";
import { TransfersRequest, UpdateTransferRequest } from "../data/TransfersRequest";

interface UpdateTransferRequestFormProps {
    transfersRequest?: TransfersRequest | null,
    onUpdate: (updatedTransfersRequest: TransfersRequest) => void
    onCancel: () => void
}

const {Text} = Typography;

const UpdateTransfersRequestForm: React.FC<UpdateTransferRequestFormProps> = ({transfersRequest, onUpdate, onCancel}) => {
    const {id} = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

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

    const handleSubmit = (values: any) => {
        if (transfersRequest) {
            const updatedTransfersRequest: TransfersRequest = {
                ...transfersRequest,
                ...values,
                createdAt: transfersRequest.createdAt,
                updatedAt: null,
                approverId: transfersRequest.approverId,
            };
            onUpdate(updatedTransfersRequest);
            message.success('Cập nhật thành công!');
        } else {
            message.error('Bản yêu cầu không tồn tại!');
        }
    };

    return(
        <div>
           <Form
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
            form={form}
            layout="horizontal"
            style={{ maxWidth: 900 }}
            onFinish={handleSubmit}
        >
            <Form.Item label="Người tạo" name="createdByEmployeeId" rules={[{ required: true, message: 'Vui lòng nhập ID người tạo!' }]}>
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
        </div>
    )
}

export default UpdateTransfersRequestForm;