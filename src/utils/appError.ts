import { HttpStatusCode } from '../constants/httpCodes.constant';

class AppError extends Error {
    constructor(
        public statusCode: HttpStatusCode,
        public message: string,
    ) {
        super(message);
    }
}

export default AppError;
