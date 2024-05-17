/* eslint-disable prettier/prettier */
import { IAppUnitOfWork } from "@app/data/abstraction/IAppUnitOfWork";
import { AppUnitOfWorkFactoryIdentifier, IAppUnitOfWorkFactory } from "@app/data/abstraction/IAppUnitOfWorkFactory";
import { IUser } from "@app/data/abstraction/entities/IUsers";
import { generateAccessToken } from "@app/utils/GenJwtToken";
import { using } from "@nipacloud/framework/core/disposable";
import { UnauthorizedError } from "@nipacloud/framework/core/http";
import { Inject, Service } from "@nipacloud/framework/core/ioc";
import jwt from "jsonwebtoken";
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
        const token: any = jwt.verify(header.token, process.env.JWT_ACCESS_SECRET);
        const allowRoles = ["ADMIN", "REVIEWER"];
        const hasAccess = allowRoles.includes(token.roles);
        if (!hasAccess) {
            throw new UnauthorizedError("Invalid Token.");
        }
        return using(this.unitOfWorkFactory.create())((uow: IAppUnitOfWork) => {
            const option = UserQueryOptionMaker.fromUserListQueryParams(params);
            return this.userDomainServices.list(uow, option);
        });
    }
    public async getById(userId: string, header: IUserHeader): Promise<IUser> {
        const token: any = jwt.verify(header.token, process.env.JWT_ACCESS_SECRET);
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
                    throw new UnauthorizedError("Invalid Token.");
                }
            }
            return user;
        });
    }
    public async create(body: CreateUserRequest): Promise<void> {
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            const entity = await body.toUserEntity();
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
            const token = generateAccessToken(user.user_id, user.roles);
            return { token: token, user: { user_id: user.user_id, roles: user.roles } };
        });
    }

    public async update(userId: string, body: UpdateUserRequest): Promise<void> {
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            const entity = body.toUserEntity();
            return this.userDomainServices.update(uow, userId, entity);
        });
    }

    public async updateRoles(userId: string, roles: UserRoles): Promise<void> {
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            return this.userDomainServices.update(uow, userId, { roles });
        });
    }

    public async delete(userId: string, header: IUserHeader) {
        const token: any = jwt.verify(header.token, process.env.SECRET);
        const allowedRoles = ["ADMIN"];
        const hasAccess = allowedRoles.includes(token.roles);
        if (!hasAccess) {
            throw new UnauthorizedError("Invalid Token.");
        }
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            return this.userDomainServices.delete(uow, userId);
        });
    }
}
