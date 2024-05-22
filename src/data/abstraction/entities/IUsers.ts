import { UserRoles } from "@app/modules/users/model/Defination";

export interface IUser {
    user_id: string;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    email: string;
    roles: UserRoles;
    is_delete: boolean;
}
