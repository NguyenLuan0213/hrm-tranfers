import React, { useEffect, useState } from "react";
import { Button, Form, message, Select, Transfer } from "antd";
//import dữ liệu
import { TransferDecision, TransferDecisionStatus} from "../data/transfer_decision";
import { TransfersRequest } from "../../dieu-huong-dieu-chuyen/data/transfer_request";
//import services
import { getmockTransfersRequest } from "../../dieu-huong-dieu-chuyen/services/transfers_request_services";
import { getNameEmployee } from "../../nhan-vien/services/employee_services";
import { addTransferDecision } from "../services/transfer_decision_service"
//import hooks
import { useUserRole } from "../../../hooks/UserRoleContext";

interface AddTransfersDecisionFormProps {
    onUpdate: (transfersDecision: TransferDecision) => void;
    onCancel: () => void;
}

const AddTransfersDecisionForm: React.FC<AddTransfersDecisionFormProps> = ({ onUpdate, onCancel }) => {
    const [form] = Form.useForm<TransferDecision>();
    const [transferRequests, setTransferRequests] = useState<TransfersRequest[]>([]);
    const [employee, setEmployee] = useState<{ id: number; name: string; }[]>([]);

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
    const handleAddTransfersDecision = async (values: TransferDecision) => {
        const newTransferDecision: TransferDecision = {
            ...values,
            createdByEmployeeId: selectedId || null,
            approverId: null,
            status: TransferDecisionStatus.DRAFT,
            effectiveDate: null,
            createdAt: new Date(),
            updatedAt: null,
        };
        try {
            const addedTransDeccisions = await addTransferDecision(newTransferDecision);
            onUpdate(addedTransDeccisions);  // Chỉ gọi cập nhật sau khi thành công
            message.success('Thêm yêu cầu điều chuyển mới thành công');
        } catch (error) {
            message.error(`${error}`);
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
                <Select 
                    style={{ width: '100%' }}
                    placeholder="Chọn mã đơn yêu cầu - Người tạo đơn yêu cầu"
                >
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
                    Đồng ý
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={onCancel}>
                    Hủy bỏ
                </Button>
            </Form.Item>
        </Form>
    );
}

export default AddTransfersDecisionForm;