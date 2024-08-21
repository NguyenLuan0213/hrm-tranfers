import React from "react";
import { Form, Input, Button, Checkbox, InputNumber, Tag, Select, message } from "antd";
import { ApprovalTransferRequest } from "../data/ApprovalTransferRequest";

const { TextArea } = Input;

interface ApprovalTransferRequestFormProps {
    requestId?: Number | null;
    approvalTransferRequest?: ApprovalTransferRequest | null;
    onSubmit: (approvalTransferRequest: ApprovalTransferRequest) => void;
    onCancel: () => void;
}


const ApprovalTransferRequestForm: React.FC<ApprovalTransferRequestFormProps> = ({ requestId, approvalTransferRequest, onSubmit, onCancel }) => {
    const [form] = Form.useForm();

    const handleSubmit = (values: any) => {
        const newApprovalTransferRequest: ApprovalTransferRequest = {
            ...approvalTransferRequest,
            ...values,
            approvalDate: new Date().toISOString(),
            requestId: requestId || 0,
        };
        onSubmit(newApprovalTransferRequest);
        message.success('Cập nhật thành công!');
        console.log(newApprovalTransferRequest);
    };

    return (
        <Form
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
            form={form}
            layout="horizontal"
            style={{ maxWidth: 900 }}
            onFinish={handleSubmit}
        >
            <Form.Item label="Người duyệt đơn:" name="approverId" rules={[{ required: true, message: 'Vui lòng nhập người duyệt đơn!' }]}>
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Nhận xét:" name="remarks">
                <TextArea rows={4} />
            </Form.Item>

            <Form.Item label="Quyết định:" name="approvalsAction" rules={[{ required: true, message: 'Vui lòng chọn quyết định duyệt đơn' }]}>
                <Select defaultValue={"SUBMIT"}>
                    <Select.Option value="SUBMIT">SUBMIT</Select.Option>
                    <Select.Option value="REQUEST_EDIT">REQUEST_EDIT</Select.Option>
                    <Select.Option value="APPROVE">APPROVE</Select.Option>
                    <Select.Option value="REJECT">REJECT</Select.Option>
                    <Select.Option value="CANCEL">CANCEL</Select.Option>
                </Select>
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

export default ApprovalTransferRequestForm;