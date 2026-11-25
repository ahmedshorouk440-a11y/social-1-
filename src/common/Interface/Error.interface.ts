

export interface IError extends Error {
    status?: number;
    statusCode?: number;
    cause?: { status?: number };
}