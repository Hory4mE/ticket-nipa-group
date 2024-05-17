import {
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
import { IListUserQueryParameter } from "./query/ListUserQueryParameter";
import { IUserHeader } from "./query/UserHeader";

@JsonController("/v1/users")
export class UserController {
    @Get("/")
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
            // const service = container.get(UserServices);
            // const result = await service.create(body);
            return { message: "login success" };
        } catch (error) {
            throw error;
        }
    }
    @Patch("/:userId")
    public async updateUserPassword(
        @RequestScopeContainer() container: ContainerInstance,
        @Param("userId") userId: string,
        @HeaderParams() header : IUserHeader,
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
    public async updateUserRoles(
        @RequestScopeContainer() container: ContainerInstance,
        @Param("userId") userId: string,
        @Body() body: UpdateRolesRequest
    ) {
        const service = container.get(UserServices);
        return service.updateRoles(userId, body.roles);
    }

    @Delete("/:userId")
    public async deleteUser(
        @RequestScopeContainer() container: ContainerInstance,
        @Param("userId") userId: string,
        @HeaderParams() header: IUserHeader
    ) {
        try {
            const service = container.get(UserServices);
            return service.delete(userId, header);
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
