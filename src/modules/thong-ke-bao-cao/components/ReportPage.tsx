import React from "react";
import ReportOnTransferRequest from "./ReportOnTransferRequest";
import ReportOnTransferDecision from "./ReportOnTranferDecision";
import ReportOnTransfer from "./ReportOnTransfer";

const ReportLayout: React.FC = () => {
    return (
        <div style={{ padding: 10 }}>
            <div>
                <ReportOnTransferRequest />
            </div>
            <div style={{ marginTop: 10 }}>
                <ReportOnTransferDecision />
            </div>
            <div style={{ marginTop: 10 }}>
                <ReportOnTransfer />
            </div>
        </div>
    );
};

export default ReportLayout;