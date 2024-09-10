import React from "react";
import { TransferDecisionApproval } from "../data/transfer_decision_approvals";
import { Button, Form, Input, Modal, Select } from "antd";

const { TextArea } = Input;

interface TransferDecisionApprovalProp {
    transferDecisionApproval?: TransferDecisionApproval;
    onUpdate: (transferDecisionApproval: TransferDecisionApproval) => void;
    onCancel: () => void;
}

const TransferDecisionApprovalForm: React.FC<TransferDecisionApprovalProp> = ({ onUpdate, onCancel, transferDecisionApproval }) => {
    const [form] = Form.useForm();

    // Hàm xử lý submit form
    const handleSubmit = (values: any) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn với quyết định này?',
            onOk: () => {
                const newTransferDecisionApproval: TransferDecisionApproval = {
                    ...transferDecisionApproval,
                    ...values,
                    approvalDate: new Date(),
                };
                onUpdate(newTransferDecisionApproval);
                onCancel();
            },
            onCancel() {
                // Do nothing on cancel
            },
        });
    }

    return (
        <Form
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
            form={form}
            layout="horizontal"
            style={{ maxWidth: 900 }}
            onFinish={handleSubmit}
        >

            <Form.Item label="Nhận xét:" name="remarks">
                <TextArea rows={4} />
            </Form.Item>

            <Form.Item label="Quyết định:" name="approvalsAction" rules={[{ required: true, message: 'Vui lòng chọn quyết định duyệt đơn' }]}>
                <Select defaultValue={"SUBMIT"}>
                    <Select.Option value="REQUEST_EDIT">REQUEST_EDIT</Select.Option>
                    <Select.Option value="APPROVE">APPROVE</Select.Option>
                    <Select.Option value="REJECT">REJECT</Select.Option>
                    {(transferDecisionApproval?.approvalsAction === 'SUBMIT' && transferDecisionApproval?.approverId) ? (
                        <Select.Option value="CANCEL">CANCEL</Select.Option>
                    ) : null}
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" >
                    Submit
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={onCancel}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    )
}

export default TransferDecisionApprovalForm;