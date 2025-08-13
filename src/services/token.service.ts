import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants/envs.constant';
import logger from '../lib/logger';

export class TokenService {
    public signJwt = (
        payload: object,
        secret: string = JWT_SECRET,
        options?: object,
    ): string => {
        return jwt.sign(payload, secret, options);
    };

    public validateToken = (token: string): any => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error: any) {
            logger.error(`Invalid token: ${error.message.trim()}`);
            return null;
        }
    };
}
