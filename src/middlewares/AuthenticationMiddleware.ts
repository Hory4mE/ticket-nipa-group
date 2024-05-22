import { UserRoles } from '@app/modules/users/model/Defination';
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
        const validRoles = Object.values(UserRoles);

        // Validate roles against UserRoles enum
        const userRoles = user.roles.filter((role: any) => validRoles.includes(role))

        console.log("user : ", user)
        console.log("user roles : ", user.roles)
        if (!user) throw new UnauthorizedError("You're not the one of our user");
        //No Roles required
        if (roles.length === 0) return true;
        // Authorized some of role in user roles
        if (roles.some(role => userRoles.roles.includes(role))) return true;

        return false; // unexpected error

    } catch (error) {
        throw new InternalServerError("Unexpected error occurred. Please contact Administrator");
    }
};
