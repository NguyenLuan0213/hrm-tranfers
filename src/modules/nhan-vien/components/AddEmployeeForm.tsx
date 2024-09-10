import React, { useState } from 'react';
import { PlusOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Row, Select, Upload, Col } from 'antd';
//import data
import { Departments } from '../../phong-ban/data/department_data';

const { Option } = Select;

interface AddEmployeeFormProps {
    Department: Departments[] | null;
    onFinish: (values: any, fileList: any[]) => void;
    onCancel: () => void;
}

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ Department, onFinish, onCancel }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);

    // Hàm xóa trắng form
    const handleReset = () => {
        form.resetFields();
        setFileList([]);
    };

    // Hàm thay đổi file
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
            onFinish={(values) => onFinish(values, fileList)}
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
                <Select placeholder="Chọn phòng ban">
                    {Department && Department.map(dep => (
                        <Option key={dep.id} value={dep.id}>{dep.name} Id: {dep.id}</Option>
                    ))}
                </Select>
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