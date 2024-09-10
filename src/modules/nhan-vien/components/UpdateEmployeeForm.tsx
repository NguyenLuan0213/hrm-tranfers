import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, Upload, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
//import data
import { Employee } from '../data/employees_data';
import { Departments } from '../../phong-ban/data/department_data';

interface UpdateFormProps {
    employee?: Employee;
    department: Departments[];
    onUpdate: (values: any, fileList: any[]) => void;
    onCancel: () => void;
}

const { Option } = Select;

const UpdateForm: React.FC<UpdateFormProps> = ({ employee, department, onUpdate, onCancel }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);

    // Hàm hiển thị dữ liệu cần update
    useEffect(() => {
        if (employee) {
            form.setFieldsValue({
                name: employee.name,
                username: employee.username,
                email: employee.email,
                phone: employee.phone,
                gender: employee.gender ? 'female' : 'male',
                born: dayjs(employee.born),
                role: employee.role,
                idDepartment: employee.idDepartment,
            });

            if (employee.avatar) {
                setFileList([{
                    uid: '-1',
                    url: employee.avatar,
                    name: 'avatar',
                    status: 'done',
                }]);
            }
        }
    }, [employee, form]);

    // Hàm thay đổi file
    const handleUploadChange = ({ fileList }: any) => {
        setFileList(fileList);
    };

    // Hàm xử lý trước khi upload
    const handleBeforeUpload = (file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setFileList([{
                uid: file.uid,
                name: file.name,
                status: 'done',
                url: reader.result as string,
            }]);
        };
        return false; // Ngăn không cho upload tự động
    };

    // Hàm submit form
    const handleSubmit = (values: any) => {
        Modal.confirm({
            title: 'Xác nhận cập nhật',
            content: 'Bạn có chắc chắn muốn cập nhật thông tin nhân viên này không?',
            okText: 'Cập nhật',
            cancelText: 'Hủy',
            onOk: () => {
                if (employee) {
                    const updatedEmployee: Employee = {
                        ...employee,
                        ...values,
                        born: values.born.toDate(),
                        gender: values.gender === 'male' ? false : true,
                        avatar: fileList.length > 0 ? fileList[0].url : employee.avatar
                    };
                    onUpdate(updatedEmployee, fileList); // Pass the fileList as the second argument
                } else {
                    message.error('Không tìm thấy nhân viên');
                }
            }
        });
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="phone" label="SĐT" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
                <Select>
                    <Option value="male">Nam</Option>
                    <Option value="female">Nữ</Option>
                </Select>
            </Form.Item>
            <Form.Item name="born" label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
                <DatePicker />
            </Form.Item>
            <Form.Item name="role" label="Chức vụ" rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="idDepartment" label="Phòng ban" rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}>
                <Select placeholder="Chọn phòng ban">
                    {department.map(dep => (
                        <Option key={dep.id} value={dep.id}>{dep.name} Id: {dep.id}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Avatar">
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleUploadChange}
                    beforeUpload={handleBeforeUpload}
                >
                    {fileList.length >= 1 ? null : <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>}
                </Upload>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Cập nhật
                </Button>
                <Button style={{ margin: '0 8px' }} onClick={onCancel}>
                    Hủy
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UpdateForm;