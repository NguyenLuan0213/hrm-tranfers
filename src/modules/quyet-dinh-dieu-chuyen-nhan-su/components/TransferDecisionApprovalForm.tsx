import React from "react";
import { Button, Form, Input, Modal, Select } from "antd";
//import dữ liệu
import { TransferDecisionApproval, ApprovalsAction } from "../data/transfer-decision-approvals";
//import hooks
import { getDecisionApprovalStatusLabel } from "../hooks/use-get-decision-status-label";

const { TextArea } = Input;

interface TransferDecisionApprovalProp {
    transferDecisionApproval?: TransferDecisionApproval;
    status: ApprovalsAction;
    onUpdate: (transferDecisionApproval: TransferDecisionApproval) => void;
    onCancel: () => void;
}

const TransferDecisionApprovalForm: React.FC<TransferDecisionApprovalProp> = ({ onUpdate, status, onCancel, transferDecisionApproval }) => {
    const [form] = Form.useForm<TransferDecisionApproval>();

    // Hàm xử lý submit form
    const handleSubmit = (values: TransferDecisionApproval) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn với quyết định này?',
            onOk: () => {
                const newTransferDecisionApproval: TransferDecisionApproval = {
                    ...transferDecisionApproval,
                    ...values,
                    approvalDate: new Date(),
                };
                onUpdate(newTransferDecisionApproval);
                form.resetFields();
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

            <Form.Item
                label="Quyết định:"
                name="approvalsAction"
                rules={[{ required: true, message: 'Vui lòng chọn quyết định duyệt đơn' }]}>
                <Select defaultValue={getDecisionApprovalStatusLabel(status)}>
                    <Select.Option value={ApprovalsAction.REQUEST_EDIT}>{getDecisionApprovalStatusLabel(ApprovalsAction.REQUEST_EDIT)}</Select.Option>
                    <Select.Option value={ApprovalsAction.APPROVE}>{getDecisionApprovalStatusLabel(ApprovalsAction.APPROVE)}</Select.Option>
                    <Select.Option value={ApprovalsAction.REJECT}>{getDecisionApprovalStatusLabel(ApprovalsAction.REJECT)}</Select.Option>
                    {(transferDecisionApproval?.approvalsAction === ApprovalsAction.SUBMIT && transferDecisionApproval?.approverId) ? (
                        <Select.Option value={ApprovalsAction.CANCEL}>{getDecisionApprovalStatusLabel(ApprovalsAction.CANCEL)}</Select.Option>
                    ) : null}
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" >
                    Đồng ý
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={onCancel}>
                    Hủy bỏ
                </Button>
            </Form.Item>
        </Form>
    )
}

export default TransferDecisionApprovalForm;