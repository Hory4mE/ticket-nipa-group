import { UnauthorizedError } from '@nipacloud/framework/core/http';
import jwt from 'jsonwebtoken';

export const verifyAccessToken = (header_token: any) => {
    try {
        const decoded = jwt.verify(header_token, process.env.JWT_ACCESS_SECRET);
        return decoded;
    } catch (error) {
        throw new UnauthorizedError("token expired")
    }
};