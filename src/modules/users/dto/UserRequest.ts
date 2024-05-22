import { IUser } from "@app/data/abstraction/entities/IUsers";
import { hashData } from "@app/utils/HashData";
import { Expose, IsString } from "@nipacloud/framework/core/util/validator";
import { randomUUID } from "crypto";
import { UserRoles } from "../model/Defination";

export class CreateUserRequest {
    @Expose({ name: "username" })
    @IsString()
    username: string;

    @Expose({ name: "password" })
    @IsString()
    password: string;

    @Expose({ name: "first_name" })
    @IsString()
    first_name: string;

    @Expose({ name: "last_name" })
    @IsString()
    last_name: string;

    @Expose({ name: "email" })
    @IsString()
    email: string;

    public async toUserEntity(): Promise<IUser> {
        const passwordHash: string = await hashData(this.password);
        const user = {
            user_id: randomUUID(),
            username: this.username,
            password: passwordHash,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            roles: UserRoles.USER,
            is_delete: false,
        };
        return user;
    }
}
export class LoginUserRequest {
    @Expose({ name: "username" })
    @IsString()
    username: string;

    @Expose({ name: "password" })
    @IsString()
    password: string;
}

export class UpdateUserRequest {
    @Expose({ name: "password" })
    @IsString()
    password: string;

    public async toUserEntity(): Promise<Partial<IUser>> {
        const passwordHash: string = await hashData(this.password);
        const user = {
            password: passwordHash,
        };
        return user;
    }
}

export class UpdateRolesRequest {
    @Expose({ name: "roles" })
    @IsString()
    roles: UserRoles;
}
