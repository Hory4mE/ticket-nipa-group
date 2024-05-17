import { ApplicationError } from "@nipacloud/framework/core/error";
import {
    BadRequestError,
    Body,
    Delete,
    ForbiddenError,
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
import { DatabaseError } from "@nipacloud/framework/data/sql";
import { JsonWebTokenError } from "jsonwebtoken";
import "reflect-metadata";
import { TicketService } from "./TicketServices";
import { CreateTicketRequest, UpdateTicketRequest, UpdateTicketStatusRequest } from "./dto/TicketRequest";
import { IListTicketQueryParameter } from "./query/ListTicketQueryParameter";
import { ITicketHeader } from "./query/TicketHeader";

@JsonController("/v1/tickets")
export class TicketController {
    @Get("/")
    public async listTickets(
        @RequestScopeContainer() container: ContainerInstance,
        @QueryParams() queryParam: IListTicketQueryParameter,
        @HeaderParams() header: ITicketHeader
    ) {
        try {
            const service = container.get(TicketService);
            return service.list(queryParam, header);
        } catch (error) {
            console.error(error);
            switch (true) {
                case error instanceof NotFoundError:
                    throw error;
                case error instanceof DatabaseError:
                    throw error;
                case error instanceof JsonWebTokenError:
                    throw error;
                // throw new JsonWebTokenError("jwt err");
                case error instanceof InternalServerError:
                    throw error;
                default:
                    throw error;
            }
        }
    }

    @Get("/:ticketId")
    public async getTicketById(
        @RequestScopeContainer() container: ContainerInstance,
        @Param("ticketId") ticketId: string,
        @HeaderParams() header: ITicketHeader
    ) {
        try {
            const service = container.get(TicketService);
            return service.getById(ticketId, header);
        } catch (error) {
            switch (true) {
                case error instanceof ApplicationError:
                    throw error;
                case error instanceof NotFoundError:
                    throw error;
                case error instanceof BadRequestError:
                    throw error;
                case error instanceof InternalServerError:
                    throw error;
                default:
                    throw error;
            }
        }
    }

    @Post("/")
    public async createTicket(
        @RequestScopeContainer() container: ContainerInstance,
        @Body() body: CreateTicketRequest,
        @HeaderParams() header: ITicketHeader
    ) {
        try {
            const service = container.get(TicketService);
            await service.create(body, header);
            return { message: "create success" };
        } catch (error) {
            switch (true) {
                case error instanceof NotFoundError:
                    throw error;
                case error instanceof UnauthorizedError:
                    throw error;
                case error instanceof ApplicationError:
                    throw error;
                case error instanceof BadRequestError:
                    throw error;
                case error instanceof InternalServerError:
                    throw error;
                case error instanceof ForbiddenError:
                    throw error;
            }
        }
    }

    @Patch("/:ticketId")
    public async updateTicket(
        @RequestScopeContainer() container: ContainerInstance,
        @Param("ticketId") ticketId: string,
        @Body() body: UpdateTicketRequest,
        @HeaderParams() header: ITicketHeader
    ) {
        try {
            const service = container.get(TicketService);
            const result = await service.update(ticketId, body, header);
            return { message: "update success" };
        } catch (error) {
            switch (true) {
                case error instanceof ApplicationError:
                    throw error;
                case error instanceof UnauthorizedError:
                    throw error;
                case error instanceof NotFoundError:
                    throw error;
                case error instanceof ForbiddenError:
                    throw error;
                case error instanceof BadRequestError:
                    throw error;
                case error instanceof InternalServerError:
                    throw error;
            }
        }
    }

    @Patch("/:ticketId/status")
    public async updateTicketStatus(
        @RequestScopeContainer() container: ContainerInstance,
        @Param("ticketId") ticketId: string,
        @Body() body: UpdateTicketStatusRequest,
        @HeaderParams() header: ITicketHeader
    ) {
        try {
            const service = container.get(TicketService);
            await service.updateStatus(ticketId, body.status, header);
            return { message: "status update success" };
        } catch (error) {
            switch (true) {
                case error instanceof NotFoundError:
                    throw error;
                case error instanceof ApplicationError:
                    throw error;
                case error instanceof ForbiddenError:
                    throw error;
                case error instanceof BadRequestError:
                    throw error;
                case error instanceof InternalServerError:
                    throw error;
            }
        }
    }

    @Delete("/:ticketId")
    public async deleteTicket(
        @RequestScopeContainer() container: ContainerInstance,
        @Param("ticketId") ticketId: string,
        @HeaderParams() header: ITicketHeader
    ) {
        try {
            const service = container.get(TicketService);
            await service.delete(ticketId, header);
            return { message: "delete success" };
        } catch (error) {
            switch (true) {
                case error instanceof UnauthorizedError:
                    throw error;
                case error instanceof NotFoundError:
                    throw error;
                case error instanceof ApplicationError:
                    throw error;
                case error instanceof ForbiddenError:
                    throw error;
                case error instanceof BadRequestError:
                    throw error;
                case error instanceof InternalServerError:
                    throw error;
            }
        }
    }
}
