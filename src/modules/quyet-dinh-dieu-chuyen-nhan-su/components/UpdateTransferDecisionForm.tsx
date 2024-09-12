import React, { useEffect } from "react";
import { Button, Form, message, Select } from "antd";
//import dữ liệu
import { TransferDecision } from "../data/transfer_decision";
import { TransfersRequest } from "../../dieu-huong-dieu-chuyen/data/transfer_request";
//import services
import { getmockTransfersRequest } from "../../dieu-huong-dieu-chuyen/services/transfers_request_services"
import { getNameEmployee } from "../../nhan-vien/services/employee_services"
import { updateTransferDecision } from "../services/transfer_decision_service"

export interface UpdateTransferDecisionFormProps {
    transferDecision?: TransferDecision | null;
    onUpdate: (updatedTransferDecision: TransferDecision) => void;
    onCancel: () => void;
}

const UpdateTransferDecisionForm: React.FC<UpdateTransferDecisionFormProps> = ({ transferDecision, onCancel, onUpdate }) => {
    const [form] = Form.useForm<TransferDecision>();
    const [employees, setEmployees] = React.useState<{ id: number, name: string }[]>([]);
    const [transfersRequests, setTransfersRequests] = React.useState<TransfersRequest[]>([]);

    //Lấy dữ liệu nhân viên và yêu cầu điều chuyển
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
    const handleSubmit = async (values: TransferDecision) => {
        if (transferDecision) {
            const updatedTransferDecision: TransferDecision = {
                ...transferDecision,
                ...values,
            };
            try {
                await updateTransferDecision(transferDecision.id, updatedTransferDecision);
                onUpdate(updatedTransferDecision);
                onCancel();
            } catch (error) {
                message.error((error as Error).message);
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
                        Đồng ý
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={onCancel}>
                        Hủy bỏ
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default UpdateTransferDecisionForm;