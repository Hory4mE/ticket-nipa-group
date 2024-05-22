import { verifyAccessToken } from '@app/utils/VerifyAccessToken';
import { InternalServerError, UnauthorizedError } from '@nipacloud/framework/core/http';
import { Action } from 'routing-controllers';

export const authorizationChecker = async (action: Action, roles: string[]) => {
    const token = await action.request.headers['token'];
    if (!token) {
        throw new UnauthorizedError("Invalid Token");
    }

    try {
        const user: any = verifyAccessToken(token)

        if (!user) throw new UnauthorizedError("You're not the one of our user");
        //No Roles required
        if (roles.length === 0) return true;
        // Authorized some of role in user roles
        if (roles.some(role => user.roles.includes(role))) return true;

        return false; // unexpected error

    } catch (error) {
        throw new InternalServerError("Unexpected error occurred. Please contact Administrator");
    }
};
