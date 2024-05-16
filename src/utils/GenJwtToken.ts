import { UserRoles } from "@app/modules/users/model/Defination"
import jwt from "jsonwebtoken"

export const generateAccessToken = (user_id: string, role: UserRoles) => {
    return jwt.sign({ user_id: user_id, roles: role }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1h" })
}

export const generateRefreshToken = (user_id: string, role: UserRoles) => {
    return jwt.sign({ user_id: user_id, roles: role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "3d" })
}
