import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants/envs.constant';

export const signJwt = (
    payload: object,
    secret: string = JWT_SECRET,
    options?: object,
): string => {
    return jwt.sign(payload, secret, options);
};
