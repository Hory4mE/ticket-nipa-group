import { UserRoles } from "@app/modules/users/model/Defination";
import jwt from "jsonwebtoken";

export const generateAccessToken = (user_id: string, username: string, role: UserRoles) => {
    return jwt.sign({ user_id: user_id, username: username, roles: role }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "1d",
    });
};

export const generateRefreshToken = (user_id: string, username: string, role: UserRoles) => {
    return jwt.sign({ user_id: user_id, username: username, roles: role }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "3d",
    });
};
