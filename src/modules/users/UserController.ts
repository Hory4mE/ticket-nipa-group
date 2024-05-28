import {
    Authorized,
    Body,
    Delete,
    Get,
    HeaderParams,
    InternalServerError,
    JsonController,
    NotFoundError,
    Param,
    Patch,
    Post,
    QueryParams,
    RequestScopeContainer,
    UnauthorizedError,
} from "@nipacloud/framework/core/http";
import { ContainerInstance } from "@nipacloud/framework/core/ioc";
import "reflect-metadata";
import { UserServices } from "./UserServices";
import { CreateUserRequest, LoginUserRequest, UpdateRolesRequest, UpdateUserRequest } from "./dto/UserRequest";
import { UserRoles } from "./model/Defination";
import { IListUserQueryParameter } from "./query/ListUserQueryParameter";
import { IUserHeader } from "./query/UserHeader";

@JsonController("/v1/users")
export class UserController {
    @Get("/")
    @Authorized([UserRoles.ADMIN, UserRoles.REVIEWER])
    public async listUsers(
        @RequestScopeContainer() container: ContainerInstance,
        @QueryParams() queryParam: IListUserQueryParameter,
        @HeaderParams() header: IUserHeader
    ) {
        try {
            const service = container.get(UserServices);
            return service.list(queryParam, header);
        } catch (error) {
            switch (true) {
                case error instanceof NotFoundError:
                    throw error;
                case error instanceof InternalServerError:
                    throw error;
            }
        }
    }

    @Get("/:userId")
    @Authorized([UserRoles.USER, UserRoles.ADMIN])
    public async getUserById(
        @RequestScopeContainer() container: ContainerInstance,
        @Param("userId") userId: string,
        @HeaderParams() header: IUserHeader
    ) {
        try {
            const service = container.get(UserServices);
            return service.getById(userId, header);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            } else {
                throw error;
            }
        }
    }

    @Post("/")
    @Authorized([UserRoles.USER, UserRoles.ADMIN])
    public async createUser(@RequestScopeContainer() container: ContainerInstance, @Body() body: CreateUserRequest) {
        try {
            const service = container.get(UserServices);
            await service.create(body);
            return { message: "create success" };
        } catch (error) {
            throw error;
        }
    }
    @Post("/login")
    public async loginUser(@RequestScopeContainer() container: ContainerInstance, @Body() body: LoginUserRequest) {
        try {
            const service = container.get(UserServices);
            const response = await service.login(body);
            return response;
        } catch (error) {
            switch (true) {
                case error instanceof UnauthorizedError:
                    throw error;
                case error instanceof InternalServerError:
                    throw error;
            }
        }
    }
    @Patch("/:userId")
    @Authorized([UserRoles.USER])
    public async updateUserPassword(
        @RequestScopeContainer() container: ContainerInstance,
        @Param("userId") userId: string,
        @HeaderParams() header: IUserHeader,
        @Body() body: UpdateUserRequest
    ) {
        try {
            const service = container.get(UserServices);
            const result = await service.update(userId, body, header);
            return { message: "update success" };
        } catch (error) {
            throw error;
        }
    }

    @Patch("/:userId/roles")
    @Authorized([UserRoles.ADMIN])
    public async updateUserRoles(
        @RequestScopeContainer() container: ContainerInstance,
        @Param("userId") userId: string,
        @Body() body: UpdateRolesRequest,
        @HeaderParams() header: IUserHeader
    ) {
        const service = container.get(UserServices);
        const result = await service.updateRoles(userId, body.roles, header);
        return { message: "Roles Updated" };
    }

    @Delete("/:userId")
    @Authorized([UserRoles.ADMIN])
    public async deleteUser(
        @RequestScopeContainer() container: ContainerInstance,
        @Param("userId") userId: string,
        @HeaderParams() header: IUserHeader
    ) {
        try {
            const service = container.get(UserServices);
            const result = await service.delete(userId, header);
            return { message: "Roles Updated" };
        } catch (error) {
            switch (true) {
                case error instanceof UnauthorizedError:
                    throw error;
                case error instanceof NotFoundError:
                    throw error;
                case error instanceof InternalServerError:
                    throw error;
            }
        }
    }
}
