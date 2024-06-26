/* eslint-disable prettier/prettier */
import { IAppUnitOfWork } from "@app/data/abstraction/IAppUnitOfWork";
import { AppUnitOfWorkFactoryIdentifier, IAppUnitOfWorkFactory } from "@app/data/abstraction/IAppUnitOfWorkFactory";
import { IUser } from "@app/data/abstraction/entities/IUsers";
import { generateAccessToken } from "@app/utils/GenJwtToken";
import { verifyAccessToken } from "@app/utils/VerifyAccessToken";
import { using } from "@nipacloud/framework/core/disposable";
import { BadRequestError, UnauthorizedError } from "@nipacloud/framework/core/http";
import { Inject, Service } from "@nipacloud/framework/core/ioc";
import { UserDomainService } from "./UserDomainService";
import { CreateUserRequest, LoginUserRequest, UpdateUserRequest } from "./dto/UserRequest";
import { UserRoles } from "./model/Defination";
import { IListUserQueryParameter } from "./query/ListUserQueryParameter";
import { IUserHeader } from "./query/UserHeader";
import { UserQueryOptionMaker } from "./query/UserQueryOption";
import bcrypt = require("bcrypt");

@Service()
export class UserServices {
    @Inject(AppUnitOfWorkFactoryIdentifier)
    private unitOfWorkFactory: IAppUnitOfWorkFactory;

    @Inject()
    private userDomainServices: UserDomainService;

    public async list(params: IListUserQueryParameter, header: IUserHeader): Promise<IUser[]> {
        const token: any = verifyAccessToken(header.token);
        const allowRoles = ["ADMIN", "REVIEWER"];
        const hasAccess = allowRoles.includes(token.roles);
        if (!hasAccess) {
            throw new UnauthorizedError("You don't have permission to list all user.");
        }
        return using(this.unitOfWorkFactory.create())((uow: IAppUnitOfWork) => {
            const option = UserQueryOptionMaker.fromUserListQueryParams(params);
            return this.userDomainServices.list(uow, option);
        });
    }
    public async getById(userId: string, header: IUserHeader): Promise<IUser> {
        const token: any = verifyAccessToken(header.token);
        const allowRoles = ["ADMIN"];
        const allowRolesUser = ["USER"];
        const hasAccessAll = allowRoles.includes(token.roles);
        const hasAccessSelf = allowRolesUser.includes(token.roles);
        if (!hasAccessAll && !hasAccessSelf) {
            throw new UnauthorizedError("Invalid Token.");
        }
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            const user = await this.userDomainServices.findById(uow, userId);
            if (hasAccessSelf) {
                if (user.user_id != token.user_id || user.roles != token.roles) {
                    throw new UnauthorizedError("You don't have permission to do this action!");
                }
            }
            return user;
        });
    }
    public async create(body: CreateUserRequest): Promise<void> {
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            const { username } = body;
            const entity = await body.toUserEntity();
            const params = new IListUserQueryParameter();
            params.username = username;
            const option = UserQueryOptionMaker.fromUserListQueryParams(params);
            const [user] = await this.userDomainServices.list(uow, option);
            if (user) {
                throw new BadRequestError("Duplicate username");
            }
            return this.userDomainServices.create(uow, entity);
        });
    }

    public async login(body: LoginUserRequest): Promise<any> {
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            const { username, password } = body;
            const params = new IListUserQueryParameter();
            params.username = username;
            const option = UserQueryOptionMaker.fromUserListQueryParams(params);
            const [user] = await this.userDomainServices.list(uow, option);
            const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password);
            if (!(user && passwordCorrect)) {
                throw new UnauthorizedError("Invalid username or password");
            }
            if (user.is_delete) {
                throw new UnauthorizedError("User has already been deleted");
            }
            const token = generateAccessToken(user.user_id, user.username, user.roles);
            return { token: token };
        });
    }

    public async update(userId: string, body: UpdateUserRequest, header: IUserHeader): Promise<void> {
        const token: any = verifyAccessToken(header.token);
        const allowRoles = ["ADMIN"];
        const allowRolesUser = ["USER"];
        const hasAccessAll = allowRoles.includes(token.roles);
        const hasAccessSelf = allowRolesUser.includes(token.roles);
        if (!hasAccessAll && !hasAccessSelf) {
            throw new UnauthorizedError("Invalid Token.");
        }
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            const entity = await body.toUserEntity();
            const user = await this.userDomainServices.findById(uow, userId);
            if (user.user_id != token.user_id || user.roles != token.roles) {
                throw new UnauthorizedError("You don't have permission to update this user's data.");
            }
            return this.userDomainServices.update(uow, userId, entity);
        });
    }

    public async updateRoles(userId: string, roles: UserRoles, header: IUserHeader): Promise<void> {
        const token: any = verifyAccessToken(header.token);
        const allowedRoles = ["ADMIN"];
        const hasAccess = allowedRoles.includes(token.roles);
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            if (!hasAccess) {
                throw new UnauthorizedError("You don't have permission to update this roles.");
            }
            return this.userDomainServices.update(uow, userId, { roles });
        });
    }

    public async delete(userId: string, header: IUserHeader) {
        const token: any = verifyAccessToken(header.token);
        const allowedRoles = ["ADMIN"];
        const hasAccess = allowedRoles.includes(token.roles);
        if (!hasAccess) {
            throw new UnauthorizedError("You don't have permission to delete this user.");
        }
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            return this.userDomainServices.delete(uow, userId);
        });
    }
}
