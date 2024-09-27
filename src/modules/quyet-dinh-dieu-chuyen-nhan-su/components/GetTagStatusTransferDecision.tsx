import { Tag } from 'antd';
//Import dữ liệu
import { TransferDecisionStatus } from '../data/transfer-decision';
import { ApprovalsAction } from '../data/transfer-decision-approvals';
//Import hooks
import { getDecisionApprovalStatusLabel, getDecisionStatusLabel } from '../hooks/use-get-decision-status-label';

//Hàm hiển thị trạng thái đơn yêu cầu điều chuyển
export const getStatusTag = (status: TransferDecisionStatus): JSX.Element => {
    const label = getDecisionStatusLabel(status);
    const tagStyle = { fontSize: '13px' }; // Điều chỉnh kích thước chữ tại đây

    switch (status) {
        case TransferDecisionStatus.DRAFT:
            return <Tag color="default" style={tagStyle}>{label}</Tag>;
        case TransferDecisionStatus.PENDING:
            return <Tag color="blue" style={tagStyle}>{label}</Tag>;
        case TransferDecisionStatus.EDITING:
            return <Tag color="orange" style={tagStyle}>{label}</Tag>;
        case TransferDecisionStatus.APPROVED:
            return <Tag color="green" style={tagStyle}>{label}</Tag>;
        case TransferDecisionStatus.REJECTED:
            return <Tag color="red" style={tagStyle}>{label}</Tag>;
        case TransferDecisionStatus.CANCELLED:
            return <Tag color="gray" style={tagStyle}>{label}</Tag>;
        default:
            return <Tag color="default" style={tagStyle}>{label}</Tag>;
    }
}

//Hàm hiển thị trạng thái duyệt đơn yêu cầu điều chuyển
export const getStatusTagApprove = (status: ApprovalsAction): JSX.Element => {
    const label = getDecisionApprovalStatusLabel(status);
    const tagStyle = { fontSize: '13px' }; // Điều chỉnh kích thước chữ tại đây

    switch (status) {
        case ApprovalsAction.SUBMIT:
            return <Tag color="default" style={tagStyle}>{label}</Tag>;
        case ApprovalsAction.REQUEST_EDIT:
            return <Tag color="orange" style={tagStyle}>{label}</Tag>;
        case ApprovalsAction.APPROVE:
            return <Tag color="green" style={tagStyle}>{label}</Tag>;
        case ApprovalsAction.REJECT:
            return <Tag color="red" style={tagStyle}>{label}</Tag>;
        case ApprovalsAction.CANCEL:
            return <Tag color="gray" style={tagStyle}>{label}</Tag>;
        default:
            return <Tag color="default" style={tagStyle}>{label}</Tag>;
    }
};