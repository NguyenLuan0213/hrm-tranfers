import React from "react";
import ReportOnTransferRequest from "./ReportOnTransferRequest";
import ReportOnTransferDecision from "./ReportOnTranferDecision";
import ReportAll from "./ReportAll";

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
                <ReportAll />
            </div>
        </div>
    );
};

export default ReportLayout;