import React, { useEffect } from "react";
import { TransferDecision } from "../data/transfer_decision";
import { Button, Form, message, Select } from "antd";
import { getmockTransfersRequest } from "../../dieu-huong-dieu-chuyen/services/transfers_request_services";
import { getNameEmployee } from "../../nhan-vien/services/employee_services";
import { addTransferDecision } from "../services/transfer_decision_service"
import { useUserRole } from "../../../hooks/UserRoleContext";

interface AddTransfersDecisionFormProps {
    onUpdate: (transfersDecision: TransferDecision) => void;
    onCancel: () => void;
}

const AddTransfersDecisionForm: React.FC<AddTransfersDecisionFormProps> = ({ onUpdate, onCancel }) => {
    const [form] = Form.useForm();
    const [transferRequests, setTransferRequests] = React.useState<any[]>([]);
    const [employee, setEmployee] = React.useState<any[]>([]);

    const { selectedId } = useUserRole();

    //Lấy danh sách yêu cầu và nhân viên
    useEffect(() => {
        const fetchData = async () => {
            //Lấy danh sách yêu cầu
            const approvalTransferRequests = await getmockTransfersRequest();
            setTransferRequests(approvalTransferRequests);
            //Lấy danh sách nhân viên
            const employee = await getNameEmployee();
            setEmployee(employee);
        }
        fetchData();
    }, []);

    //hàm thêm quyết định điều chuyển
    const handleAddTransfersDecision = async (values: any) => {
        const newTransferDecision: TransferDecision = {
            ...values,
            createdByEmployeeId: selectedId,
            approverId: null,
            status: 'DRAFT',
            effectiveDate: null,
            createdAt: new Date(),
            updatedAt: null,
        };
        try {
            const addedTransDeccisions = await addTransferDecision(newTransferDecision);
            onUpdate(addedTransDeccisions);  // Chỉ gọi cập nhật sau khi thành công
            message.success('Thêm yêu cầu điều chuyển mới thành công');
        } catch (error: any) {
            message.error(`Thêm yêu cầu điều chuyển mới thất bại: ${error.message}`);
        }
        onUpdate(values);
    };

    return (
        <Form
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
            form={form}
            layout="horizontal"
            style={{ maxWidth: 900 }}
            onFinish={handleAddTransfersDecision}
        >
            <Form.Item
                label="Chọn đơn yêu cầu"
                name="requestId"
                rules={[
                    { required: true, message: 'Vui lòng chọn or nhập đơn cần duyệt!' },
                ]}
            >
                <Select style={{ width: '100%' }}>
                    {transferRequests
                        .filter(trans => trans.status === 'APPROVED')
                        .map(trans => (
                            <Select.Option key={trans.id} value={trans.id}>
                                {`ID:${trans.id} - ${employee.find(emp => emp.id === trans.createdByEmployeeId)?.name}`}
                            </Select.Option>
                        ))}
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

export default AddTransfersDecisionForm;