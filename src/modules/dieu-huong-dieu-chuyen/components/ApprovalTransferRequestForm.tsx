import React, { useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
//import dữ liệu
import { ApprovalTransferRequest, ApprovalStatus } from "../data/transfer_request_approvals";
//import hooks
import { useUserRole } from "../../../hooks/UserRoleContext";
import { getRequestApprovalStatusLabel } from "../hooks/use_get_request_status_label"
//import services
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
            approvalsAction: values[approvalTransferRequest?.approvalsAction as ApprovalStatus],
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
                <Select defaultValue={getRequestApprovalStatusLabel(ApprovalStatus.SUBMIT)}>
                    <Select.Option value={ApprovalStatus.REQUEST_EDIT}>{getRequestApprovalStatusLabel(ApprovalStatus.REQUEST_EDIT)}</Select.Option>
                    <Select.Option value={ApprovalStatus.APPROVE}>{getRequestApprovalStatusLabel(ApprovalStatus.APPROVE)}</Select.Option>
                    <Select.Option value={ApprovalStatus.REJECT}>{getRequestApprovalStatusLabel(ApprovalStatus.REJECT)}</Select.Option>
                    {(approvalTransferRequest?.approvalsAction === ApprovalStatus.SUBMIT && approvalTransferRequest?.approverId) ? (
                        <Select.Option value={ApprovalStatus.CANCEL}>{getRequestApprovalStatusLabel(ApprovalStatus.CANCEL)}</Select.Option>
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