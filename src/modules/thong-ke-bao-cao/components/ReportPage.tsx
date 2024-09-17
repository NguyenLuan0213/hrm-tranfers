import React, { useState } from "react";
import { Select } from "antd";
import ReportOnTransferRequest from "./ReportOnTransferRequest";
import ReportOnTransferDecision from "./ReportOnTranferDecision";
import ReportOnTransfer from "./ReportOnTransfer";

const { Option } = Select;

const ReportLayout: React.FC = () => {
    const [selectedReport, setSelectedReport] = useState<string>("request");

    const handleChange = (value: string) => {
        setSelectedReport(value);
    };

    return (
        <div style={{ padding: 10 }}>
            <Select defaultValue="request" style={{ width: 420, marginBottom: 20 }} onChange={handleChange}>
                <Option value="request">Báo cáo hiệu quả điều chuyển đơn yêu cầu điều chuyển</Option>
                <Option value="decision">Báo cáo hiệu quả điều chuyển đơn quyết định điều chuyển</Option>
                <Option value="transfer">Báo cáo hiệu quả điều chuyển chung</Option>
            </Select>
            {selectedReport === "request" && (
                <ReportOnTransferRequest />
            )}
            {selectedReport === "decision" && (
                <ReportOnTransferDecision />
            )}
            {selectedReport === "transfer" && (
                <ReportOnTransfer />
            )}
        </div>
    );
};

export default ReportLayout;