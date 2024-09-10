import { Tag } from 'antd';
import { TransferRequestStatus } from '../data/transfer_request';
import { getRequestStatusLabel, getRequestApprovalStatusLabel } from '../hooks/use_get_request_status_label';
import { ApprovalStatus } from '../data/transfer_request_approvals';

//Hàm hiển thị trạng thái đơn yêu cầu điều chuyển
export const getStatusTag = (status: TransferRequestStatus): JSX.Element => {
    const label = getRequestStatusLabel(status);
    const tagStyle = { fontSize: '13px' }; // Điều chỉnh kích thước chữ tại đây

    switch (status) {
        case TransferRequestStatus.DRAFT:
            return <Tag color="default" style={tagStyle}>{label}</Tag>;
        case TransferRequestStatus.PENDING:
            return <Tag color="blue" style={tagStyle}>{label}</Tag>;
        case TransferRequestStatus.EDITING:
            return <Tag color="orange" style={tagStyle}>{label}</Tag>;
        case TransferRequestStatus.APPROVED:
            return <Tag color="green" style={tagStyle}>{label}</Tag>;
        case TransferRequestStatus.REJECTED:
            return <Tag color="red" style={tagStyle}>{label}</Tag>;
        case TransferRequestStatus.CANCELLED:
            return <Tag color="gray" style={tagStyle}>{label}</Tag>;
        default:
            return <Tag color="default" style={tagStyle}>{label}</Tag>;
    }
}

//Hàm hiển thị trạng thái duyệt đơn yêu cầu điều chuyển
export const getStatusTagApprove = (status: ApprovalStatus): JSX.Element => {
    const label = getRequestApprovalStatusLabel(status);
    const tagStyle = { fontSize: '13px' }; // Điều chỉnh kích thước chữ tại đây

    switch (status) {
        case ApprovalStatus.SUBMIT:
            return <Tag color="blue" style={tagStyle}>{label}</Tag>;
        case ApprovalStatus.REQUEST_EDIT:
            return <Tag color="orange" style={tagStyle}>{label}</Tag>;
        case ApprovalStatus.APPROVE:
            return <Tag color="green" style={tagStyle}>{label}</Tag>;
        case ApprovalStatus.REJECT:
            return <Tag color="red" style={tagStyle}>{label}</Tag>;
        case ApprovalStatus.CANCEL:
            return <Tag color="gray" style={tagStyle}>{label}</Tag>;
        default:
            return <Tag color="default" style={tagStyle}>{label}</Tag>;
    }
};