import React, { useEffect, useState } from "react";
import { Card, Typography } from "antd";
import dayjs from "dayjs";
//import dữ liệu
import { Departments } from "../../phong-ban/data/department-data";
import { TransferDecision } from "../data/transfer-decision";
import { TransferRequestStatus } from "../../dieu-huong-dieu-chuyen/data/transfer-request";
//import helpers
import { getStatusTag } from "../helpers/GetTagStatusTransferDecision";
//import service
import { getDepartment } from "../../phong-ban/services/department-services";
import { getTransfersRequestById } from "../../dieu-huong-dieu-chuyen/services/transfers-request-services";


const { Text } = Typography;

interface CardDetailTransferRequestProps {
    transfersDecision: TransferDecision | null;
    employee: { id: number; name: string; }[];
}

const CardDetailTransferRequest: React.FC<CardDetailTransferRequestProps> = ({ transfersDecision, employee }) => {
    const [requestInfo, setRequestInfo] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [department, setDepartment] = useState<any>(null);

    //lấy dữ liệu đơn yêu cầu điều chuyển
    useEffect(() => {
        const fetchRequestInfo = async () => {
            if (transfersDecision?.requestId) {
                setLoading(true);
                const info = await getTransfersRequestById(transfersDecision.requestId);
                setRequestInfo(info);
                setLoading(false);
            }
        };
        fetchRequestInfo();
    }, [transfersDecision?.requestId]);

    //lấy dữ liệu phòng ban
    useEffect(() => {
        const fetchDepartment = async () => {
            const departmentData = await getDepartment();
            setDepartment(departmentData);
        };
        fetchDepartment();
    }, []);

    return (
        <Card
            style={{ marginTop: 15 }}
            title="Chi tiết đơn yêu cầu điều chuyển"
            bordered={false}
            loading={loading}
        >
            <div>
                <Text strong>ID:</Text> <Text>{requestInfo?.id}</Text>
                <br />
                <Text strong>Trạng thái:</Text> {getStatusTag(requestInfo?.status || TransferRequestStatus.DRAFT)}
                <br />
                <Text strong>Người tạo đơn:</Text> <Text>{employee.find((emp) => emp.id === requestInfo?.createdByEmployeeId)?.name || 'Chưa cập nhật'}</Text>
                <br />
                <Text strong>Người đã duyệt:</Text> <Text>{employee.find((emp) => emp.id === requestInfo?.approverId)?.name || 'Chưa cập nhật'}</Text>
                <br />
                <Text strong>Từ nơi:</Text> <Text>{department?.find((dep: Departments) => dep.id === requestInfo?.departmentIdFrom)?.name}</Text>
                <br />
                <Text strong>Đến nơi:</Text> <Text>{department?.find((dep: Departments) => dep.id === requestInfo?.departmentIdTo)?.name}</Text>
                <br />
                <Text strong>Từ chức vụ:</Text> <Text>{requestInfo?.positionFrom}</Text>
                <br />
                <Text strong>Đến chức vụ:</Text> <Text>{requestInfo?.positionTo}</Text>
                <br />
                <Text strong>Từ địa chỉ:</Text> <Text>{requestInfo?.locationFrom}</Text>
                <br />
                <Text strong>Đến địa chỉ:</Text> <Text>{requestInfo?.locationTo}</Text>
                <br />
                <Text strong>Ngày tạo:</Text> <Text>{requestInfo?.createdAt ? dayjs(requestInfo.createdAt).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text>
                <br />
                <Text strong>Ngày duyệt đơn:</Text> <Text>{requestInfo?.updatedAt ? dayjs(requestInfo.updatedAt).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Text>
                <br />
            </div>
        </Card>
    );
}

export default CardDetailTransferRequest;