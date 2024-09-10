//Import thư viện dayjs và các plugin cần thiết
import dayjs from 'dayjs';
dayjs.extend(isBetween);
dayjs.extend(quarterOfYear);
import isBetween from 'dayjs/plugin/isBetween';
import quarterOfYear from 'dayjs/plugin/quarterOfYear'; // Thêm import cho quarterOfYear
//Import dữ liệu
import { TransferDecision, TransferDecisionStatus, mockTransDecisions } from "../data/transfer_decision"
import { mockTransfersRequest } from "../../dieu-huong-dieu-chuyen/data/transfer_request"
import { mockEmployees } from "../../nhan-vien/data/employees_data"
//Import service
import { updateEmployee } from "../../nhan-vien/services/employee_services"

// Hàm lấy danh sách quyết định điều chuyển
export const getTransfersDecisions = async (): Promise<TransferDecision[]> => {
    return mockTransDecisions;
};

// Hàm thêm quyết định điều chuyển mới
export const addTransferDecision = async (transferDecision: TransferDecision): Promise<TransferDecision> => {
    // Kiểm tra nếu đã tồn tại quyết định điều chuyển cho yêu cầu này
    const existingDecision = mockTransDecisions.find(td => td.requestId === transferDecision.requestId &&
        ![TransferDecisionStatus.APPROVED, TransferDecisionStatus.REJECTED, TransferDecisionStatus.CANCELLED].includes(td.status));

    if (existingDecision) {
        throw new Error('Đã tồn tại quyết định điều chuyển cho yêu cầu này');
    }

    // Tạo quyết định điều chuyển mới và thêm vào danh sách giả lập
    const newTransferDecision = { ...transferDecision, id: mockTransDecisions.length + 1 };
    mockTransDecisions.push(newTransferDecision);
    return newTransferDecision;
}

// Hàm lấy số lượng quyết định điều chuyển
export const getLengthTransfersDecisions = async (): Promise<number> => {
    return mockTransDecisions.length;
}

// Hàm lấy quyết định điều chuyển theo ID
export const getTransferDecisionById = async (id: number): Promise<TransferDecision> => {
    return mockTransDecisions.find(td => td.id === id)!;
}

// Hàm cập nhật quyết định điều chuyển theo ID
export const updateTransferDecision = async (id: number, transferDecision: TransferDecision): Promise<TransferDecision | undefined> => {
    const existingDecision = mockTransDecisions.find(td => td.requestId === transferDecision.requestId &&
        ![TransferDecisionStatus.APPROVED, TransferDecisionStatus.REJECTED, TransferDecisionStatus.CANCELLED].includes(td.status));

    if (existingDecision) {
        throw new Error('Đã có một quyết định đang xử lý cho yêu cầu này');
    }

    const index = mockTransDecisions.findIndex(td => td.id === id);
    if (index !== -1) {
        mockTransDecisions[index] = { ...transferDecision };
        return mockTransDecisions[index];
    }
    return undefined;
};

// Hàm hủy quyết định điều chuyển theo ID
export const cancelTransferDecision = async (id: number): Promise<void> => {
    const index = mockTransDecisions.findIndex(td => td.id === id);
    if (index !== -1) {
        mockTransDecisions[index].status = TransferDecisionStatus.CANCELLED;
    }
};

// Hàm gửi quyết định điều chuyển theo ID
export const sendTransferDecision = async (id: number): Promise<void> => {
    const index = mockTransDecisions.findIndex(td => td.id === id);
    if (index !== -1) {
        mockTransDecisions[index].status = TransferDecisionStatus.PENDING;
    }
}

// Hàm cập nhật quyết định điều chuyển đã được phê duyệt
export const updateApproveTransferDecision = async (id: number, transferDecision: TransferDecision): Promise<TransferDecision | undefined> => {
    const index = mockTransDecisions.findIndex(td => td.id === id); // Tìm quyết định điều chuyển theo ID
    if (index !== -1) {
        mockTransDecisions[index] = { ...transferDecision };
        return mockTransDecisions[index];
    }
    return undefined;
}

// Hàm cập nhật thông tin nhân viên sau khi phê duyệt quyết định điều chuyển
export const updateEmployeeAlterApproval = async (id: number): Promise<void> => {
    const transferRequest = mockTransfersRequest.findIndex(tr => tr.id === id);
    if (transferRequest !== -1) { // Nếu tìm thấy yêu cầu
        const employee = mockEmployees.find(e => e.id === mockTransfersRequest[transferRequest].createdByEmployeeId);
        if (employee) {
            employee.idDepartment = mockTransfersRequest[transferRequest].departmentIdTo;
            employee.role = mockTransfersRequest[transferRequest].positionTo;
            updateEmployee(employee.id, employee);
        } else {
            throw new Error('Không tìm thấy nhân viên');
        }
    } else {
        throw new Error('Không tìm thấy yêu cầu');
    }
}

// Hàm lấy thống kê quyết định điều chuyển theo ngày
export const getStatisticalDecisionsByDay = async (startDate: string, endDate: string): Promise<{ period: string, count: number }[]> => {
    const result: { [key: string]: number } = {}; // Tạo một object lưu kết quả thống kê
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    mockTransDecisions.forEach(decision => {
        if (decision.status === TransferDecisionStatus.APPROVED) {
            const decisionDate = dayjs(decision.createdAt); // Lấy ngày tạo quyết định
            // Kiểm tra ngày tạo quyết định có nằm trong khoảng thời gian không
            if (decisionDate.isBetween(start, end, 'day', '[]')) {
                const period = decisionDate.format('YYYY-MM-DD');
                // Nếu đã có kết quả thống kê cho ngày này thì tăng lên 1, ngược lại thì tạo mới
                if (result[period]) {
                    result[period]++;
                } else {
                    result[period] = 1;
                }
            }
        }
    });

    // Tạo một mảng chứa các ngày trong khoảng thời gian
    const datesInRange: string[] = [];
    let currentDate = start;

    // Duyệt qua từng ngày trong khoảng thời gian
    while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
        const formattedDate = currentDate.format('YYYY-MM-DD');
        datesInRange.push(formattedDate);

        if (!result[formattedDate]) {
            result[formattedDate] = 0;
        }

        currentDate = currentDate.add(1, 'day');
    }

    return datesInRange.map(date => ({ period: date, count: result[date] }));
}

// Hàm lấy thống kê quyết định điều chuyển theo tháng
export const getStatisticalDecisionsByMonth = async (startDate: string, endDate: string): Promise<{ period: string, count: number }[]> => {
    const result: { [key: string]: number } = {};
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // Duyệt qua từng quyết định điều chuyển
    mockTransDecisions.forEach(decision => {
        if (decision.status === TransferDecisionStatus.APPROVED) {
            const decisionDate = dayjs(decision.createdAt);
            // Kiểm tra ngày tạo quyết điều chuyển có nằm trong khoảng thời gian không
            if (decisionDate.isBetween(start, end, 'month', '[]')) {
                const period = decisionDate.format('YYYY-MM');
                // Nếu đã có kết quả thống kê cho tháng này thì tăng lên 1, ngược lại thì tạo mới
                if (result[period]) {
                    result[period]++;
                } else {
                    result[period] = 1;
                }
            }
        }
    });

    // Tạo một mảng chứa các tháng trong khoảng thời gian
    const datesInRange: string[] = [];
    let currentDate = start;

    // Duyệt qua từng tháng trong khoảng thời gian
    while (currentDate.isBefore(end) || currentDate.isSame(end, 'month')) {
        const formattedDate = currentDate.format('YYYY-MM');
        datesInRange.push(formattedDate);

        if (!result[formattedDate]) {
            result[formattedDate] = 0;
        }

        currentDate = currentDate.add(1, 'month');
    }

    return datesInRange.map(date => ({ period: date, count: result[date] }));
}

// Hàm lấy thống kê quyết định điều chuyển theo quý
export const getStatisticalDecisionsByQuarter = async (startDate: string, endDate: string): Promise<{ period: string, count: number }[]> => {
    const result: { [key: string]: number } = {}; // Tạo một object lưu kết quả thống kê
    const start = dayjs(startDate).startOf('quarter') as dayjs.Dayjs;
    const end = dayjs(endDate).endOf('quarter') as dayjs.Dayjs;

    // Duyệt qua từng quyết định điều chuyển
    mockTransDecisions.forEach(decision => {
        if (decision.status === TransferDecisionStatus.APPROVED) {
            const decisionDate = dayjs(decision.createdAt);
            if (decisionDate.isBetween(start, end, 'day', '[]')) {
                const quarter = Math.floor(decisionDate.month() / 3) + 1;
                const period = `${decisionDate.year()}-Q${quarter}`;

                // Nếu đã có kết quả thống kê cho quý này thì tăng lên 1, ngược lại thì tạo mới
                if (result[period]) {
                    result[period]++;
                } else {
                    result[period] = 1;
                }
            }
        }
    });

    // Tạo một mảng chứa các quý trong khoảng thời gian
    const datesInRange: string[] = [];
    let currentDate = start;

    // Duyệt qua từng quý trong khoảng thời gian
    while (currentDate.isBefore(end) || currentDate.isSame(end, 'quarter')) {
        const formattedDate = `${currentDate.year()}-Q${currentDate.quarter()}`;
        datesInRange.push(formattedDate);

        // Nếu không có kết quả thống kê cho quý này thì tạo mới
        if (!result[formattedDate]) {
            result[formattedDate] = 0;
        }

        currentDate = currentDate.add(1, 'quarter');
    }

    return datesInRange.map(date => ({ period: date, count: result[date] }));
}

// Hàm lấy thống kê quyết định điều chuyển theo năm
export const getStatisticalDecisionsByYear = async (startDate: string, endDate: string): Promise<{ period: string, count: number }[]> => {
    const result: { [key: string]: number } = {};
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // Duyệt qua từng quyết định điều chuyển
    mockTransDecisions.forEach(decision => {
        if (decision.status === TransferDecisionStatus.APPROVED) {
            const decisionDate = dayjs(decision.createdAt);
            // Kiểm tra ngày tạo quyết định có nằm trong khoảng thời gian không
            if (decisionDate.isBetween(start, end, 'year', '[]')) {
                const period = decisionDate.format('YYYY');

                // Nếu đã có kết quả thống kê cho năm này thì tăng lên 1, ngược lại thì tạo mới
                if (result[period]) {
                    result[period]++;
                } else {
                    result[period] = 1;
                }
            }
        }
    });

    const datesInRange: string[] = [];
    let currentDate = start;

    // Duyệt qua từng năm trong khoảng thời gian
    while (currentDate.isBefore(end) || currentDate.isSame(end, 'year')) {
        const formattedDate = currentDate.format('YYYY');
        datesInRange.push(formattedDate);

        // Nếu không có kết quả thống kê cho năm này thì tạo mới
        if (!result[formattedDate]) {
            result[formattedDate] = 0;
        }

        currentDate = currentDate.add(1, 'year');
    }

    return datesInRange.map(date => ({ period: date, count: result[date] }));
}

// Hàm thống kê số lượng đơn quyết định điều chuyển trạng thái theo tháng
export const getDecisionsStatus = async (): Promise<{ status: string, count: number }[]> => {
    const result: { [key: string]: number } = {
        DRAFT: 0,
        APPROVED: 0,
        PENDING: 0,
        EDITING: 0,
        REJECTED: 0,
        CANCELLED: 0
    };

    // Duyệt qua tất cả các quyết định điều chuyển và phân loại chúng theo trạng thái
    mockTransDecisions.forEach(decision => {
        if (result.hasOwnProperty(decision.status)) {
            result[decision.status]++;
        }
    });

    // Trả về kết quả thống kê dưới dạng mảng các đối tượng
    return Object.keys(result).map(status => ({
        status,
        count: result[status]
    }));
}

// Hàm thống kê ngày thực quyết định điều chuyển theo ngày
export const getEffectiveDecisionsByDay = async (startDate: string, endDate: string)
    : Promise<{ period: string, count: number }[]> => {
    const result: { [key: string]: number } = {};
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // Duyệt qua từng quyết định điều chuyển
    mockTransDecisions.forEach(decision => {
        if (decision.status === TransferDecisionStatus.APPROVED) {
            const decisionDate = dayjs(decision.effectiveDate);
            // Kiểm tra ngày tạo quyết định có nằm trong khoảng thời gian không
            if (decisionDate.isBetween(start, end, 'day', '[]')) {
                const period = decisionDate.format('YYYY-MM-DD');
                // Nếu đã có kết quả thống kê cho ngày này thì tăng lên 1, ngược lại thì tạo mới
                if (result[period]) {
                    result[period]++;
                } else {
                    result[period] = 1;
                }
            }
        }
    });

    const datesInRange: string[] = [];
    let currentDate = start;

    // Duyệt qua từng ngày trong khoảng thời gian
    while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
        const formattedDate = currentDate.format('YYYY-MM-DD');
        datesInRange.push(formattedDate);

        if (!result[formattedDate]) {
            result[formattedDate] = 0;
        }

        currentDate = currentDate.add(1, 'day');
    }

    return datesInRange.map(date => ({ period: date, count: result[date] }));
}

// Hàm thống kê ngày thực quyết định điều chuyển theo tháng
export const getEffectiveDecisionsByMonth = async (startDate: string, endDate: string): Promise<{ period: string, count: number }[]> => {
    const result: { [key: string]: number } = {};
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // Duyệt qua từng quyết định điều chuyển
    mockTransDecisions.forEach(decision => {
        if (decision.status === TransferDecisionStatus.APPROVED) {
            const decisionDate = dayjs(decision.effectiveDate);
            // Kiểm tra ngày tạo quyết định có nằm trong khoảng thời gian không
            if (decisionDate.isBetween(start, end, 'month', '[]')) {
                const period = decisionDate.format('YYYY-MM');
                // Nếu đã có kết quả thống kê cho tháng này thì tăng lên 1, ngược lại thì tạo mới
                if (result[period]) {
                    result[period]++;
                } else {
                    result[period] = 1;
                }
            }
        }
    });

    const datesInRange: string[] = [];
    let currentDate = start;

    // Duyệt qua từng tháng trong khoảng thời gian
    while (currentDate.isBefore(end) || currentDate.isSame(end, 'month')) {
        const formattedDate = currentDate.format('YYYY-MM');
        datesInRange.push(formattedDate);

        if (!result[formattedDate]) {
            result[formattedDate] = 0;
        }

        currentDate = currentDate.add(1, 'month');
    }

    return datesInRange.map(date => ({ period: date, count: result[date] }));
}

// Hàm thống kê ngày thực quyết định điều chuyển theo quý
export const getEffectiveDecisionsByQuarter = async (startDate: string, endDate: string): Promise<{ period: string, count: number }[]> => {
    const result: { [key: string]: number } = {};
    const start = dayjs(startDate).startOf('quarter') as dayjs.Dayjs;
    const end = dayjs(endDate).endOf('quarter') as dayjs.Dayjs;

    // Duyệt qua từng quyết định điều chuyển
    mockTransDecisions.forEach(decision => {
        if (decision.status === TransferDecisionStatus.APPROVED) {
            const decisionDate = dayjs(decision.effectiveDate);
            // Kiểm tra ngày tạo quyết định có nằm trong khoảng thời gian không
            if (decisionDate.isBetween(start, end, 'day', '[]')) {
                const quarter = Math.floor(decisionDate.month() / 3) + 1;
                const period = `${decisionDate.year()}-Q${quarter}`;
                // Nếu đã có kết quả thống kê cho quý này thì tăng lên 1, ngược lại thì tạo mới
                if (result[period]) {
                    result[period]++;
                } else {
                    result[period] = 1;
                }
            }
        }
    });

    const datesInRange: string[] = [];
    let currentDate = start;

    // Duyệt qua từng quý trong khoảng thời gian
    while (currentDate.isBefore(end) || currentDate.isSame(end, 'quarter')) {
        const formattedDate = `${currentDate.year()}-Q${currentDate.quarter()}`;
        datesInRange.push(formattedDate);

        if (!result[formattedDate]) {
            result[formattedDate] = 0;
        }

        currentDate = currentDate.add(1, 'quarter');
    }

    return datesInRange.map(date => ({ period: date, count: result[date] }));
}

// Hàm thống kê ngày thực quyết định điều chuyển theo năm
export const getEffectiveDecisionsByYear = async (startDate: string, endDate: string): Promise<{ period: string, count: number }[]> => {
    const result: { [key: string]: number } = {};
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // Duyệt qua từng quyết định điều chuyển
    mockTransDecisions.forEach(decision => {
        if (decision.status === TransferDecisionStatus.APPROVED) {
            const decisionDate = dayjs(decision.effectiveDate);
            // Kiểm tra ngày tạo quyết định có nằm trong khoảng thời gian không
            if (decisionDate.isBetween(start, end, 'year', '[]')) {
                const period = decisionDate.format('YYYY');
                // Nếu đã có kết quả thống kê cho năm này thì tăng lên 1, ngược lại thì tạo mới
                if (result[period]) {
                    result[period]++;
                } else {
                    result[period] = 1;
                }
            }
        }
    });

    const datesInRange: string[] = [];
    let currentDate = start;

    // Duyệt qua từng năm trong khoảng thời gian
    while (currentDate.isBefore(end) || currentDate.isSame(end, 'year')) {
        const formattedDate = currentDate.format('YYYY');
        datesInRange.push(formattedDate);

        if (!result[formattedDate]) {
            result[formattedDate] = 0;
        }

        currentDate = currentDate.add(1, 'year');
    }

    return datesInRange.map(date => ({ period: date, count: result[date] }));
}
