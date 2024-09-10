import React, { useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { ApprovalTransferRequest, ApprovalStatus } from "../data/transfer_request_approvals";
import { useUserRole } from "../../../hooks/UserRoleContext";
import { getCreatedByEmployeeId } from "../services/transfers_request_services";

const { TextArea } = Input;

interface ApprovalTransferRequestFormProps {
    requestId?: number | null;
    approvalTransferRequest?: ApprovalTransferRequest | null;
    onSubmit: (approvalTransferRequest: ApprovalTransferRequest) => void;
    onCancel: () => void;
}

const ApprovalTransferRequestForm: React.FC<ApprovalTransferRequestFormProps> = ({ requestId, approvalTransferRequest, onSubmit, onCancel }) => {
    const [form] = Form.useForm();
    const { selectedId } = useUserRole();
    const [userId, setUserId] = React.useState<number | null>(null);

    // Hiển thị dữ liệu cần update
    useEffect(() => {
        if (requestId === null) return;
        else {
            const fecthCreatedByEmployeeId = async () => {
                const createdByEmployeeId = await getCreatedByEmployeeId(requestId || 0);
                setUserId(createdByEmployeeId || 0);
            }
            fecthCreatedByEmployeeId();
        }
    }, [requestId]);

    // Hàm xử lý submit form
    const handleSubmit = (values: any) => {
        const newApprovalTransferRequest: ApprovalTransferRequest = {
            ...approvalTransferRequest,
            ...values,
            approvalDate: new Date().toISOString(),
            approverId: selectedId,
            requestId: requestId || 0,
        };
        onSubmit(newApprovalTransferRequest);
        message.success('Cập nhật thành công!');
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
            <Form.Item label="Nhận xét:" name="remarks">
                <TextArea rows={4} />
            </Form.Item>
            <Form.Item
                label="Quyết định:"
                name={approvalTransferRequest?.approvalsAction as ApprovalStatus}
                rules={[{ required: true, message: 'Vui lòng chọn quyết định duyệt đơn' }]}>
                <Select defaultValue={"SUBMIT"}>
                    <Select.Option value="REQUEST_EDIT">REQUEST_EDIT</Select.Option>
                    <Select.Option value="APPROVE">APPROVE</Select.Option>
                    <Select.Option value="REJECT">REJECT</Select.Option>
                    {(approvalTransferRequest?.approvalsAction === 'SUBMIT' && approvalTransferRequest?.approverId) ? (
                        <Select.Option value="CANCEL">CANCEL</Select.Option>
                    ) : null}
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