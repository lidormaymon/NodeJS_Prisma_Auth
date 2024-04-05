// message, status code, error code, error 


export class HttpException extends Error {
    message: string;
    errorCode: any
    statusCode: number
    errors: ErrorCode
    

    constructor(message:string, errorCode: ErrorCode, statusCode:number, error:any ) {
        super(message)
        this.message = message
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.errors = error
    }
}

export enum ErrorCode {
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    USER_ALREADY_EXIST = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_EXCEPTION = 500
}