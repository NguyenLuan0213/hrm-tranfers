import { TransfersRequest, mockTransfersRequest, TransferRequestStatus } from '../data/transfer_request';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
dayjs.extend(isBetween);
dayjs.extend(quarterOfYear);

export const getmockTransfersRequest = async (): Promise<TransfersRequest[]> => {
    return mockTransfersRequest;
};

export const getTransfersRequestById = async (id: number): Promise<TransfersRequest | undefined> => {
    return mockTransfersRequest.find((transfersRequest) => transfersRequest.id === id);
};

export const addTransfersRequest = async (transfersRequest: TransfersRequest): Promise<TransfersRequest> => {
    const maxId = mockTransfersRequest.length > 0 ? Math.max(...mockTransfersRequest.map((transfersRequest) => transfersRequest.id)) : 0;
    const newTransfersRequest = { ...transfersRequest, id: maxId + 1 };
    mockTransfersRequest.push(newTransfersRequest);
    return newTransfersRequest;
};

export const deleteTransferRequest = async (id: number): Promise<TransfersRequest | undefined> => {
    const transferRequest = mockTransfersRequest.find((transfer) => transfer.id === id);
    if (!transferRequest) {
        throw new Error(`Transfer request with id ${id} not found`);
    }
    transferRequest.status = TransferRequestStatus.CANCELLED;
    return transferRequest;
};

export const sendTransferRequest = async (id: number): Promise<TransfersRequest | undefined> => {
    const transfersRequest = mockTransfersRequest.find((transfersRequest) => transfersRequest.id === id);
    if (transfersRequest) {
        transfersRequest.status = TransferRequestStatus.PENDING;
        return transfersRequest;
    }
    return undefined;
};

export const updateTransferRequest = async (id: number, transfersRequest: TransfersRequest): Promise<TransfersRequest | undefined> => {
    const index = mockTransfersRequest.findIndex((transfersRequest) => transfersRequest.id === id);
    if (index !== -1) {
        mockTransfersRequest[index] = transfersRequest;
        return transfersRequest;
    }
    return undefined;
};

export const getCreatedByEmployeeId = async (requestId: number): Promise<number | undefined> => {
    const request = mockTransfersRequest.find(req => req.id === requestId);
    return request?.createdByEmployeeId;
}

// Hàm lấy dữ liệu thống kê theo ngày
export const getStatisticalByDay = async (startDate: string, endDate: string): Promise<{ period: string, count: number }[]> => {
    const result: { [key: string]: number } = {}; // Tạo một object để lưu kết quả
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // Duyệt qua tất cả các request và kiểm tra xem request nào nằm trong khoảng thời gian đã chọn
    mockTransfersRequest.forEach(request => {
        if (request.status === TransferRequestStatus.APPROVED) {
            const requestDate = dayjs(request.createdAt);
            // Nếu request nằm trong khoảng thời gian đã chọn thì tăng biến đếm lên 1
            if (requestDate.isBetween(start, end, 'day', '[]')) {
                const period = requestDate.format('YYYY-MM-DD');
                // Nếu period đã tồn tại trong object result thì tăng biến đếm lên 1, ngược lại thì gán bằng 1
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

    // Duyệt qua tất cả các ngày trong khoảng thời gian đã chọn và thêm vào mảng datesInRange
    while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
        const formattedDate = currentDate.format('YYYY-MM-DD');
        datesInRange.push(formattedDate);
        currentDate = currentDate.add(1, 'day');
    }
    // Trả về mảng kết quả với các object có cấu trúc { period: 'YYYY-MM-DD', count: số lượng request trong ngày }
    return datesInRange.map(period => ({
        period,
        count: result[period] || 0
    }));
};

// Hàm lấy dữ liệu thống kê theo tháng
export const getStatisticalByMonth = async (startDate: string, endDate: string): Promise<{ period: string, count: number }[]> => {
    const result: { [key: string]: number } = {};
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // Duyệt qua tất cả các request và kiểm tra xem request nào nằm trong khoảng thời gian đã chọn
    mockTransfersRequest.forEach(request => {
        if (request.status === TransferRequestStatus.APPROVED) {
            const requestDate = dayjs(request.createdAt);
            // Nếu request nằm trong khoảng thời gian đã chọn thì tăng biến đếm lên 1
            if (requestDate.isBetween(start, end, 'month', '[]')) {
                const period = requestDate.format('YYYY-MM');
                // Nếu period đã tồn tại trong object result thì tăng biến đếm lên 1, ngược lại thì gán bằng 1
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

    // Duyệt qua tất cả các tháng trong khoảng thời gian đã chọn và thêm vào mảng datesInRange
    while (currentDate.isBefore(end) || currentDate.isSame(end, 'month')) {
        const formattedDate = currentDate.format('YYYY-MM');
        datesInRange.push(formattedDate);
        currentDate = currentDate.add(1, 'month');
    }

    // Trả về mảng kết quả với các object có cấu trúc { period: 'YYYY-MM', count: số lượng request trong tháng }
    return datesInRange.map(period => ({
        period,
        count: result[period] || 0
    }));
};

// Hàm lấy dữ liệu thống kê theo năm
export const getStatisticalByYear = async (startDate: string, endDate: string): Promise<{ period: string, count: number }[]> => {
    const result: { [key: string]: number } = {};
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // Duyệt qua tất cả các request và kiểm tra xem request nào nằm trong khoảng thời gian đã chọn
    mockTransfersRequest.forEach(request => {
        if (request.status === TransferRequestStatus.APPROVED) {
            const requestDate = dayjs(request.createdAt);

            // Nếu request nằm trong khoảng thời gian đã chọn thì tăng biến đếm lên 1
            if (requestDate.isBetween(start, end, 'year', '[]')) {
                const period = requestDate.format('YYYY');

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

    // Duyệt qua tất cả các năm trong khoảng thời gian đã chọn và thêm vào mảng datesInRange
    while (currentDate.isBefore(end) || currentDate.isSame(end, 'year')) {
        const formattedDate = currentDate.format('YYYY');
        datesInRange.push(formattedDate);
        currentDate = currentDate.add(1, 'year');
    }

    // Trả về mảng kết quả với các object có cấu trúc { period: 'YYYY', count: số lượng request trong năm }
    return datesInRange.map(period => ({
        period,
        count: result[period] || 0
    }));
}

// Hàm lấy dữ liệu thống kê theo quý
export const getStatisticalByQuarter = async (startDate: string, endDate: string): Promise<{ period: string, count: number }[]> => {
    const result: { [key: string]: number } = {};
    const start = dayjs(startDate).startOf('quarter') as dayjs.Dayjs;
    const end = dayjs(endDate).endOf('quarter') as dayjs.Dayjs;

    // Duyệt qua tất cả các request và kiểm tra xem request nào nằm trong khoảng thời gian đã chọn
    mockTransfersRequest.forEach(request => {
        if (request.status === TransferRequestStatus.APPROVED) {
            const requestDate = dayjs(request.createdAt);
            // Nếu request nằm trong khoảng thời gian đã chọn thì tăng biến đếm lên 1
            if (requestDate.isBetween(start, end, 'day', '[]')) {
                const quarter = Math.floor(requestDate.month() / 3) + 1;
                const period = `${requestDate.year()}-Q${quarter}`;

                // Nếu period đã tồn tại trong object result thì tăng biến đếm lên 1, ngược lại thì gán bằng 1
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


    // Duyệt qua tất cả các quý trong khoảng thời gian đã chọn và thêm vào mảng datesInRange
    while (currentDate.isBefore(end) || currentDate.isSame(end, 'quarter')) {
        const quarter = Math.floor(currentDate.month() / 3) + 1;
        const formattedDate = `${currentDate.year()}-Q${quarter}`;
        if (!datesInRange.includes(formattedDate)) {
            datesInRange.push(formattedDate);
        }
        currentDate = currentDate.add(1, 'quarter');
    }

    // Trả về mảng kết quả với các object có cấu trúc { period: 'YYYY-Qx', count: số lượng request trong quý }
    return datesInRange.map(period => ({
        period,
        count: result[period] || 0
    }));
};

// hàm lấy thống kê yêu cầu điều chuyển theo tháng
export const getRequestDepartmentDataByMonth = async (startDate: string, endDate: string, id: string):
    Promise<{ period: string, countFrom: number, countTo: number }[]> => {
    const resultFrom: { [key: string]: number } = {}; // lưu kết quả của departmentIdFrom
    const resultTo: { [key: string]: number } = {}; // lưu kết quả của departmentIdTo
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // Lấy số lượng departmentIdFrom trong quyết định điều chuyển
    mockTransfersRequest.forEach(request => {
        if (request.status === TransferRequestStatus.APPROVED) {
            if (request.departmentIdFrom == parseInt(id)) { //nếu departmentIdFrom trùng với id
                const requestDate = dayjs(request.createdAt);
                if (requestDate.isBetween(start, end, 'month', '[]')) {
                    const period = requestDate.format('YYYY-MM');
                    //nếu đã có kết quả thống kê cho tháng này thì tăng lên 1, ngược lại thì tạo mới
                    if (resultFrom[period]) {
                        resultFrom[period]++;
                    } else {
                        resultFrom[period] = 1;
                    }
                }
            }
        }
    });

    // lấy số lượng departmentIdTo trong quyết định điều chuyển
    mockTransfersRequest.forEach(request => {
        if (request.status === TransferRequestStatus.APPROVED) {
            if (request.departmentIdTo == parseInt(id)) { //nếu departmentIdTo trùng với id
                const requestDate = dayjs(request.createdAt);
                if (requestDate.isBetween(start, end, 'month', '[]')) {
                    const period = requestDate.format('YYYY-MM');
                    //nếu đã có kết quả thống kê cho tháng này thì tăng lên 1, ngược lại thì tạo mới
                    if (resultTo[period]) {
                        resultTo[period]++;
                    } else {
                        resultTo[period] = 1;
                    }
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
        //nếu không có kết quả thống kê cho tháng này thì tạo mới
        if (!resultFrom[formattedDate]) {
            resultFrom[formattedDate] = 0;
        }
        //nếu không có kết quả thống kê cho tháng này thì tạo mới
        if (!resultTo[formattedDate]) {
            resultTo[formattedDate] = 0;
        }

        currentDate = currentDate.add(1, 'month');
    }

    return datesInRange.map(date => ({ period: date, countFrom: resultFrom[date], countTo: resultTo[date] }));
}

// hàm lấy thống kê yêu cầu điều chuyển theo quý
export const getRequestDepartmentDataByQuarter = async (startDate: string, endDate: string, id: string):
    Promise<{ period: string, countFrom: number, countTo: number }[]> => {
    const resultFrom: { [key: string]: number } = {};
    const resultTo: { [key: string]: number } = {};
    const start = dayjs(startDate).startOf('quarter') as dayjs.Dayjs;
    const end = dayjs(endDate).endOf('quarter') as dayjs.Dayjs;

    // Lấy số lượng departmentIdFrom trong yêu cầu điều chuyển
    mockTransfersRequest.forEach(request => {
        if (request.status === TransferRequestStatus.APPROVED) {
            // Lấy count departmentIdFrom
            if (request.departmentIdFrom == parseInt(id)) {
                const requestDate = dayjs(request.createdAt);
                if (requestDate.isBetween(start, end, 'day', '[]')) {
                    const quarter = Math.floor(requestDate.month() / 3) + 1;
                    const period = `${requestDate.year()}-Q${quarter}`;
                    if (resultFrom[period]) {
                        resultFrom[period]++;
                    } else {
                        resultFrom[period] = 1;
                    }
                }
            }
        }
    });

    // lấy số lượng departmentIdTo trong yêu cầu điều chuyển
    mockTransfersRequest.forEach(request => {
        if (request.status === TransferRequestStatus.APPROVED) {
            // Lấy count departmentIdTo
            if (request.departmentIdTo == parseInt(id)) {
                const requestDate = dayjs(request.createdAt);
                if (requestDate.isBetween(start, end, 'day', '[]')) {
                    const quarter = Math.floor(requestDate.month() / 3) + 1;
                    const period = `${requestDate.year()}-Q${quarter}`;
                    if (resultTo[period]) {
                        resultTo[period]++;
                    } else {
                        resultTo[period] = 1;
                    }
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
        //nếu không có kết quả thống kê cho quý này thì tạo mới
        if (!resultFrom[formattedDate]) {
            resultFrom[formattedDate] = 0;
        }
        //nếu không có kết quả thống kê cho quý này thì tạo mới
        if (!resultTo[formattedDate]) {
            resultTo[formattedDate] = 0;
        }

        currentDate = currentDate.add(1, 'quarter');
    }

    return datesInRange.map(date => ({ period: date, countFrom: resultFrom[date], countTo: resultTo[date] }));
}

// hàm lấy thống kê yêu cầu điều chuyển theo năm
export const getRequestDepartmentDataByYear = async (startDate: string, endDate: string, id: string):
    Promise<{ period: string, countFrom: number, countTo: number }[]> => {
    const resultFrom: { [key: string]: number } = {};
    const resultTo: { [key: string]: number } = {};
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    //lấy số lượng departmentIdFrom trong yêu cầu điều chuyển
    mockTransfersRequest.forEach(request => {
        if (request.status === TransferRequestStatus.APPROVED) {
            // Lấy count departmentIdFrom
            if (request.departmentIdFrom == parseInt(id)) {
                const requestDate = dayjs(request.createdAt);
                if (requestDate.isBetween(start, end, 'year', '[]')) {
                    const period = requestDate.format('YYYY');
                    if (resultFrom[period]) {
                        resultFrom[period]++;
                    } else {
                        resultFrom[period] = 1;
                    }
                }
            }

        }
    });

    // lấy số lượng departmentIdTo trong yêu cầu điều chuyển
    mockTransfersRequest.forEach(request => {
        if (request.status === TransferRequestStatus.APPROVED) {
            // Lấy count departmentIdTo
            if (request.departmentIdTo == parseInt(id)) {
                const requestDate = dayjs(request.createdAt);
                if (requestDate.isBetween(start, end, 'year', '[]')) {
                    const period = requestDate.format('YYYY');
                    if (resultTo[period]) {
                        resultTo[period]++;
                    } else {
                        resultTo[period] = 1;
                    }
                }
            }
        }
    });

    // Tạo một mảng chứa các năm trong khoảng thời gian
    const datesInRange: string[] = [];
    let currentDate = start;

    // Duyệt qua từng năm trong khoảng thời gian
    while (currentDate.isBefore(end) || currentDate.isSame(end, 'year')) {
        const formattedDate = currentDate.format('YYYY');
        datesInRange.push(formattedDate);
        //nếu không có kết quả thống kê cho năm này thì tạo mới
        if (!resultFrom[formattedDate]) {
            resultFrom[formattedDate] = 0;
        }
        //nếu không có kết quả thống kê cho năm này thì tạo mới
        if (!resultTo[formattedDate]) {
            resultTo[formattedDate] = 0;
        }

        currentDate = currentDate.add(1, 'year');
    }

    return datesInRange.map(date => ({ period: date, countFrom: resultFrom[date], countTo: resultTo[date] }));
}

// hàm lấy thống kê theo theo từng vị trí công việc theo tháng
export const getRequestPositionByMonth = async (startDate: string, endDate: string):
    Promise<{
        period: string,
        EmployeeToManager: number,
        ManagerToEmployee: number,
        EmployeeToEmployee: number,
        ManagerToManager: number
    }[]> => {
    const resultEmployeeToManager: { [key: string]: number } = {};
    const resultManagerToEmployee: { [key: string]: number } = {};
    const resultEmployeeToEmployee: { [key: string]: number } = {};
    const resultManagerToManager: { [key: string]: number } = {};
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    //lấy số lượng nhân viên lên trưởng phòng 
    mockTransfersRequest.forEach(request => {
        if (request.status === TransferRequestStatus.APPROVED) {
            // Lấy count positionIdFrom
            if (request.positionFrom === "Nhân viên" && request.positionTo === "Trưởng phòng") {
                const requestDate = dayjs(request.updatedAt);
                if (requestDate.isBetween(start, end, 'month', '[]')) {
                    const period = requestDate.format('YYYY-MM');
                    if (resultEmployeeToManager[period]) {
                        resultEmployeeToManager[period]++;
                    } else {
                        resultEmployeeToManager[period] = 1;
                    }
                }
            }

        }
    });

    // lấy số lượng nhân viên phòng ban này chuyển nhân viên phòng ban khác
    mockTransfersRequest.forEach(request => {
        //// Lấy count positionIdTo
        if (request.status === TransferRequestStatus.APPROVED) {
            if (request.positionFrom === "Trưởng phòng" && request.positionTo === "Nhân viên") {
                const requestDate = dayjs(request.updatedAt);
                if (requestDate.isBetween(start, end, 'month', '[]')) {
                    const period = requestDate.format('YYYY-MM');
                    if (resultEmployeeToEmployee[period]) {
                        resultEmployeeToEmployee[period]++;
                    } else {
                        resultEmployeeToEmployee[period] = 1;
                    }
                }
            }
        }
    });

    // lấy số lượng trưởng phòng phòng ban này chuyển Trường phòng phòng ban khác
    mockTransfersRequest.forEach(request => {
        //// Lấy count positionIdTo
        if (request.status === TransferRequestStatus.APPROVED) {
            if (request.positionFrom === "Nhân viên" && request.positionTo === "Nhân viên") {
                const requestDate = dayjs(request.updatedAt);
                if (requestDate.isBetween(start, end, 'month', '[]')) {
                    const period = requestDate.format('YYYY-MM');
                    if (resultManagerToManager[period]) {
                        resultManagerToManager[period]++;
                    } else {
                        resultManagerToManager[period] = 1;
                    }
                }
            }
        }
    });

    // lấy số lượng trưởng phòng xuống nhân viên
    mockTransfersRequest.forEach(request => {
        //// Lấy count positionIdTo
        if (request.status === TransferRequestStatus.APPROVED) {
            if (request.positionFrom === "Trưởng phòng" && request.positionTo === "Trưởng phòng") {
                const requestDate = dayjs(request.updatedAt);
                if (requestDate.isBetween(start, end, 'month', '[]')) {
                    const period = requestDate.format('YYYY-MM');
                    if (resultManagerToEmployee[period]) {
                        resultManagerToEmployee[period]++;
                    } else {
                        resultManagerToEmployee[period] = 1;
                    }
                }
            }
        }
    });

    const datesInRange: string[] = [];
    let currentDate = start;

    // Duyệt qua từng năm trong khoảng thời gian
    while (currentDate.isBefore(end) || currentDate.isSame(end, 'month')) {
        const formattedDate = currentDate.format('YYYY-MM');
        datesInRange.push(formattedDate);
        //nếu không có kết quả thống kê cho năm này thì tạo mới
        if (!resultEmployeeToManager[formattedDate]) {
            resultEmployeeToManager[formattedDate] = 0;
        }
        if (!resultManagerToEmployee[formattedDate]) {
            resultManagerToEmployee[formattedDate] = 0;
        }
        if (!resultEmployeeToEmployee[formattedDate]) {
            resultEmployeeToEmployee[formattedDate] = 0;
        }
        if (!resultManagerToManager[formattedDate]) {
            resultManagerToManager[formattedDate] = 0;
        }

        currentDate = currentDate.add(1, 'month');
    }

    return datesInRange.map(date => ({
        period: date, EmployeeToManager: resultEmployeeToManager[date],
        ManagerToEmployee: resultManagerToEmployee[date],
        EmployeeToEmployee: resultEmployeeToEmployee[date],
        ManagerToManager: resultManagerToManager[date]
    }));
}

// hàm lấy thống kê theo theo từng vị trí công việc theo quý
export const getRequestPositionByQuarter = async (startDate: string, endDate: string):
    Promise<{
        period: string,
        EmployeeToManager: number,
        ManagerToEmployee: number,
        EmployeeToEmployee: number,
        ManagerToManager: number
    }[]> => {
    const resultEmployeeToManager: { [key: string]: number } = {};
    const resultManagerToEmployee: { [key: string]: number } = {};
    const resultEmployeeToEmployee: { [key: string]: number } = {};
    const resultManagerToManager: { [key: string]: number } = {};
    const start = dayjs(startDate).startOf('quarter') as dayjs.Dayjs;
    const end = dayjs(endDate).endOf('quarter') as dayjs.Dayjs;

    //lấy số lượng nhân viên lên trưởng phòng
    mockTransfersRequest.forEach(request => {
        if (request.status === TransferRequestStatus.APPROVED) {
            // Lấy count positionIdFrom
            if (request.positionFrom === "Nhân viên" && request.positionTo === "Trưởng phòng") {
                const requestDate = dayjs(request.updatedAt);
                if (requestDate.isBetween(start, end, 'day', '[]')) {
                    const quarter = Math.floor(requestDate.month() / 3) + 1;
                    const period = `${requestDate.year()}-Q${quarter}`;
                    if (resultEmployeeToManager[period]) {
                        resultEmployeeToManager[period]++;
                    } else {
                        resultEmployeeToManager[period] = 1;
                    }
                }
            }

        }
    });

    // lấy số lượng nhân viên phòng ban này chuyển nhân viên phòng ban khác
    mockTransfersRequest.forEach(request => {
        //// Lấy count positionIdTo
        if (request.status === TransferRequestStatus.APPROVED) {
            if (request.positionFrom === "Trưởng phòng" && request.positionTo === "Nhân viên") {
                const requestDate = dayjs(request.updatedAt);
                if (requestDate.isBetween(start, end, 'day', '[]')) {
                    const quarter = Math.floor(requestDate.month() / 3) + 1;
                    const period = `${requestDate.year()}-Q${quarter}`;
                    if (resultEmployeeToEmployee[period]) {
                        resultEmployeeToEmployee[period]++;
                    } else {
                        resultEmployeeToEmployee[period] = 1;
                    }
                }
            }
        }
    });

    // lấy số lượng trưởng phòng phòng ban này chuyển Trường phòng phòng ban khác
    mockTransfersRequest.forEach(request => {
        //// Lấy count positionIdTo
        if (request.status === TransferRequestStatus.APPROVED) {
            if (request.positionFrom === "Nhân viên" && request.positionTo === "Nhân viên") {
                const requestDate = dayjs(request.updatedAt);
                if (requestDate.isBetween(start, end, 'day', '[]')) {
                    const quarter = Math.floor(requestDate.month() / 3) + 1;
                    const period = `${requestDate.year()}-Q${quarter}`;
                    if (resultManagerToManager[period]) {
                        resultManagerToManager[period]++;
                    } else {
                        resultManagerToManager[period] = 1;
                    }
                }
            }
        }
    });

    // lấy số lượng trưởng phòng xuống nhân viên
    mockTransfersRequest.forEach(request => {
        //// Lấy count positionIdTo
        if (request.status === TransferRequestStatus.APPROVED) {
            if (request.positionFrom === "Trưởng phòng" && request.positionTo === "Trưởng phòng") {
                const requestDate = dayjs(request.updatedAt);
                if (requestDate.isBetween(start, end, 'day', '[]')) {
                    const quarter = Math.floor(requestDate.month() / 3) + 1;
                    const period = `${requestDate.year()}-Q${quarter}`;
                    if (resultManagerToEmployee[period]) {
                        resultManagerToEmployee[period]++;
                    } else {
                        resultManagerToEmployee[period] = 1;
                    }
                }
            }
        }
    });

    const datesInRange: string[] = [];
    let currentDate = start;

    // Duyệt qua từng năm trong khoảng thời gian
    while (currentDate.isBefore(end) || currentDate.isSame(end, 'quarter')) {
        const formattedDate = `${currentDate.year()}-Q${currentDate.quarter()}`;
        datesInRange.push(formattedDate);
        //nếu không có kết quả thống kê cho năm này thì tạo mới
        if (!resultEmployeeToManager[formattedDate]) {
            resultEmployeeToManager[formattedDate] = 0;
        }
        if (!resultManagerToEmployee[formattedDate]) {
            resultManagerToEmployee[formattedDate] = 0;
        }
        if (!resultEmployeeToEmployee[formattedDate]) {
            resultEmployeeToEmployee[formattedDate] = 0;
        }
        if (!resultManagerToManager[formattedDate]) {
            resultManagerToManager[formattedDate] = 0;
        }

        currentDate = currentDate.add(1, 'quarter');
    }

    return datesInRange.map(date => ({
        period: date, EmployeeToManager: resultEmployeeToManager[date],
        ManagerToEmployee: resultManagerToEmployee[date],
        EmployeeToEmployee: resultEmployeeToEmployee[date],
        ManagerToManager: resultManagerToManager[date]
    }));

}

// hàm lấy thống kê theo theo từng vị trí công việc theo năm
export const getRequestPositionByYear = async (startDate: string, endDate: string):
    Promise<{
        period: string,
        EmployeeToManager: number,
        ManagerToEmployee: number,
        EmployeeToEmployee: number,
        ManagerToManager: number
    }[]> => {
    const resultEmployeeToManager: { [key: string]: number } = {};
    const resultManagerToEmployee: { [key: string]: number } = {};
    const resultEmployeeToEmployee: { [key: string]: number } = {};
    const resultManagerToManager: { [key: string]: number } = {};
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    //lấy số lượng nhân viên lên trưởng phòng
    mockTransfersRequest.forEach(request => {
        if (request.status === TransferRequestStatus.APPROVED) {
            // Lấy count positionIdFrom
            if (request.positionFrom === "Nhân viên" && request.positionTo === "Trưởng phòng") {
                const requestDate = dayjs(request.updatedAt);
                if (requestDate.isBetween(start, end, 'year', '[]')) {
                    const period = requestDate.format('YYYY');
                    if (resultEmployeeToManager[period]) {
                        resultEmployeeToManager[period]++;
                    } else {
                        resultEmployeeToManager[period] = 1;
                    }
                }
            }

        }
    });

    // lấy số lượng nhân viên phòng ban này chuyển nhân viên phòng ban khác
    mockTransfersRequest.forEach(request => {
        //// Lấy count positionIdTo
        if (request.status === TransferRequestStatus.APPROVED) {
            if (request.positionFrom === "Trưởng phòng" && request.positionTo === "Nhân viên") {
                const requestDate = dayjs(request.updatedAt);
                if (requestDate.isBetween(start, end, 'year', '[]')) {
                    const period = requestDate.format('YYYY');
                    if (resultEmployeeToEmployee[period]) {
                        resultEmployeeToEmployee[period]++;
                    } else {
                        resultEmployeeToEmployee[period] = 1;
                    }
                }
            }
        }
    });

    // lấy số lượng trưởng phòng phòng ban này chuyển Trường phòng phòng ban khác
    mockTransfersRequest.forEach(request => {
        //// Lấy count positionIdTo
        if (request.status === TransferRequestStatus.APPROVED) {
            if (request.positionFrom === "Nhân viên" && request.positionTo === "Nhân viên") {
                const requestDate = dayjs(request.updatedAt);
                if (requestDate.isBetween(start, end, 'year', '[]')) {
                    const period = requestDate.format('YYYY');
                    if (resultManagerToManager[period]) {
                        resultManagerToManager[period]++;
                    } else {
                        resultManagerToManager[period] = 1;
                    }
                }
            }
        }
    });

    // lấy số lượng trưởng phòng xuống nhân viên
    mockTransfersRequest.forEach(request => {
        //// Lấy count positionIdTo
        if (request.status === TransferRequestStatus.APPROVED) {
            if (request.positionFrom === "Trưởng phòng" && request.positionTo === "Trưởng phòng") {
                const requestDate = dayjs(request.updatedAt);
                if (requestDate.isBetween(start, end, 'year', '[]')) {
                    const period = requestDate.format('YYYY');
                    if (resultManagerToEmployee[period]) {
                        resultManagerToEmployee[period]++;
                    } else {
                        resultManagerToEmployee[period] = 1;
                    }
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
        //nếu không có kết quả thống kê cho năm này thì tạo mới
        if (!resultEmployeeToManager[formattedDate]) {
            resultEmployeeToManager[formattedDate] = 0;
        }
        if (!resultManagerToEmployee[formattedDate]) {
            resultManagerToEmployee[formattedDate] = 0;
        }
        if (!resultEmployeeToEmployee[formattedDate]) {
            resultEmployeeToEmployee[formattedDate] = 0;
        }
        if (!resultManagerToManager[formattedDate]) {
            resultManagerToManager[formattedDate] = 0;
        }

        currentDate = currentDate.add(1, 'year');
    }

    return datesInRange.map(date => ({
        period: date, EmployeeToManager: resultEmployeeToManager[date],
        ManagerToEmployee: resultManagerToEmployee[date],
        EmployeeToEmployee: resultEmployeeToEmployee[date],
        ManagerToManager: resultManagerToManager[date]
    }));
}

// Lấy số lượng đơn yêu cầu điều chuyển
export const getLengthTransferRequest = async (): Promise<number> => {
    return mockTransfersRequest.length;
}

// Hàm thống kê số lượng đơn yêu cầu điều chuyển trạng thái theo tháng
export const getRequestStatisticsStatus = async (): Promise<{ status: string, count: number }[]> => {
    const result: { [key: string]: number } = {
        DRAFT: 0,
        APPROVED: 0,
        PENDING: 0,
        EDITING: 0,
        REJECTED: 0,
        CANCELLED: 0
    };

    // Duyệt qua tất cả các yêu cầu điều chuyển và phân loại chúng theo trạng thái
    mockTransfersRequest.forEach(request => {
        if (result.hasOwnProperty(request.status)) {
            result[request.status]++;
        }
    });

    // Trả về kết quả thống kê dưới dạng mảng các đối tượng
    return Object.keys(result).map(status => ({
        status,
        count: result[status]
    }));
}





