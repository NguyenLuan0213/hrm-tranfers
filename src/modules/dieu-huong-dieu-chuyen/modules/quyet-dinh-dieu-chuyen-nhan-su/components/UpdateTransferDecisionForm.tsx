import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "../../../../../hooks/UserRoleContext";
import { TransferDecision } from "../data/TransfersDecision";
import { Button, Form, Input, message, Select } from "antd";
import { getmockTransfersRequest } from "../../../services/TransfersRequestServices"
import { getNameEmployee } from "../../../../nhan-vien/services/EmployeeServices"
import { UpdateTransferDecision } from "../services/TransfersDecisionsService"

export interface UpdateTransferDecisionFormProps {
    transferDecision?: TransferDecision | null;
    onUpdate: (updatedTransferDecision: TransferDecision) => void;
    onCancel: () => void;
}

const UpdateTransferDecisionForm: React.FC<UpdateTransferDecisionFormProps> = ({ transferDecision, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [employees, setEmployees] = React.useState<any[]>([]);
    const [transfersRequests, setTransfersRequests] = React.useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            //lấy dữ liệu tên nhân viên
            const employeeData = await getNameEmployee();
            setEmployees(employeeData);

            //lấy dữ liệu yêu cầu điều chuyển
            const transfersRequestData = await getmockTransfersRequest();
            setTransfersRequests(transfersRequestData);
        };
        fetchData();
    }, []);

    // Hiển thị dữ liệu cần update
    useEffect(() => {
        if (transferDecision) {
            form.setFieldsValue({
                requestId: transferDecision.requestId,
            });
        }
    }, [transferDecision, form]);

    //hàm cập nhật quyết định điều chuyển
    const handleSubmit = async (values: any) => {
        if (transferDecision) {
            const updatedTransferDecision: TransferDecision = {
                ...transferDecision,
                ...values,
            };
            try {
                await UpdateTransferDecision(transferDecision.id, updatedTransferDecision);
                onUpdate(updatedTransferDecision);
                onCancel();
            } catch (error: any) {
                message.error(`${error.message}`);
            }
        }
        onCancel();
    };
    return (
        <div>
            <Form
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
                form={form}
                layout="horizontal"
                style={{ maxWidth: 900 }}
                onFinish={handleSubmit}
            >

                <Form.Item
                    label="Chọn đơn yêu cầu"
                    name="requestId"
                    rules={[
                        { required: true, message: 'Vui lòng chọn or nhập đơn cần duyệt!' },
                    ]}
                >
                    <Select style={{ width: '100%' }}>
                        {transfersRequests
                            .filter(trans => trans.status === 'APPROVED')
                            .map(trans => (
                                <Select.Option key={trans.id} value={trans.id}>
                                    {`ID:${trans.id} - ${employees.find(emp => emp.id === trans.createdByEmployeeId)?.name}`}
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
        </div>
    );
}

export default UpdateTransferDecisionForm;