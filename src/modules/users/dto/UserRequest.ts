import { IUser } from "@app/data/abstraction/entities/IUsers";
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

  public toUserEntity(): IUser {
    const user = {
      user_id: randomUUID(),
      username: this.username,
      password: this.password,
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

  public toUserEntity(): Partial<IUser> {
    const user = {
      password: this.password,
    };
    return user;
  }
}

export class UpdateRolesRequest {
  @Expose({ name: "roles" })
  @IsString()
  roles: UserRoles;
}
