import { TransfersRequest, mockTransfersRequest } from '../data/TransfersRequest';

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

export const DeleteTransferRequest = async (id: number): Promise<TransfersRequest | undefined> => {
    const transferRequest = mockTransfersRequest.find((transfer) => transfer.id === id);
    if (!transferRequest) {
        throw new Error(`Transfer request with id ${id} not found`);
    }
    transferRequest.status = 'CANCELLED';
    return transferRequest;
};
export const SendTransferRequest = async (id: number): Promise<TransfersRequest | undefined> => {
    const transfersRequest = mockTransfersRequest.find((transfersRequest) => transfersRequest.id === id);
    if (transfersRequest) {
        transfersRequest.status = 'PENDING';
        return transfersRequest;
    }
    return undefined;
};

export const UpdateTransferRequest = async (id: number, transfersRequest: TransfersRequest): Promise<TransfersRequest | undefined> => {
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