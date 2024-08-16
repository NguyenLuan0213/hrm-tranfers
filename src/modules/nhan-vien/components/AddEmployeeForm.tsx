import React, { useState } from 'react';
import { PlusOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Row, Select, Upload, Col } from 'antd';
import dayjs from "dayjs";
import { Employee, addEmployee } from "../data/EmployeesData";

const { Option } = Select;

interface AddEmployeeFormProps {
    onUpdate: (employee: Employee) => void;
    onCancel: () => void;
}

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onUpdate, onCancel }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);

    const getBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleAddEmployee = async (values: any) => {
        const born = values.born ? dayjs(values.born).format('YYYY-MM-DD') : undefined;
        let avatarBase64 = undefined;
        if (fileList[0]?.originFileObj) {
            avatarBase64 = await getBase64(fileList[0].originFileObj);
        }
        const employee: Employee = {
            ...values,
            born,
            status: true,
            avatar: avatarBase64,
        };
        try {
            const addedEmployee = await addEmployee(employee);
            onUpdate(addedEmployee);
            alert('Thêm nhân viên mới thành công');
        } catch (error) {
            console.log(error);
            alert('Thêm nhân viên mới thất bại');
        }
    };

    const handleReset = () => {
        form.resetFields();
        setFileList([]);
    };

    const handleChange = ({ fileList: newFileList }: { fileList: any[] }) => {
        setFileList(newFileList.slice(-1));
    };

    return (
        <Form
            form={form}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            layout="horizontal"
            style={{ maxWidth: 700 }}
            onFinish={handleAddEmployee}
        >
            <Form.Item label="Họ và tên:" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                <Input placeholder='Nhập tên' />
            </Form.Item>
            <Form.Item label="Email:" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                <Input placeholder='Nhập email' />
            </Form.Item>
            <Form.Item label="Username:" name="username" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
                <Input placeholder='Nhập username' />
            </Form.Item>
            <Form.Item label="Password:" name="password">
                <Input.Password
                    placeholder="input password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
            </Form.Item>
            <Form.Item label="SĐT:" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                <Input placeholder='Nhập số điện thoại' />
            </Form.Item>
            <Form.Item label="Giới tính:" name="gender" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
                <Select placeholder="Chọn giới tính">
                    <Option value="Nam">Nam</Option>
                    <Option value="Nữ">Nữ</Option>
                </Select>
            </Form.Item>
            <Form.Item label="Chức vụ:" name="role" rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}>
                <Input placeholder='Nhập chức vụ' />
            </Form.Item>
            <Form.Item label="ID Phòng ban:" name="idDepartment" rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}>
                <Input placeholder='Nhập ID phòng ban' />
            </Form.Item>
            <Form.Item label="Ngày Sinh" name="born" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
                <DatePicker />
            </Form.Item>
            <Form.Item label="Upload" valuePropName="fileList">
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleChange}
                    beforeUpload={() => false}
                >
                    {fileList.length < 1 && (
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Chọn avatar</div>
                        </div>
                    )}
                </Upload>
            </Form.Item>
            <Row className='midal'>
                <Col span={8} offset={6}>
                    <Button type="primary" ghost htmlType="submit">
                        Thêm mới
                    </Button>
                </Col>
                <Col span={8}>
                    <Button type="primary" danger ghost onClick={handleReset}>
                        Xóa trắng
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default AddEmployeeForm;