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
} from "@nipacloud/framework/core/http";
import { ContainerInstance } from "@nipacloud/framework/core/ioc";
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
            console.log(header.token);
            return service.list(queryParam);
        } catch (error) {
            switch (true) {
                case (error instanceof NotFoundError): throw error;
                case (error instanceof InternalServerError): throw error;
            }
        }
    }

    @Get("/:ticketId")
    public async getTicketById(@RequestScopeContainer() container: ContainerInstance, @Param("ticketId") ticketId: string) {
        try {
            const service = container.get(TicketService);
            return service.getById(ticketId);
        } catch (error) {
            switch (true) {
                case (error instanceof ApplicationError): throw error;
                case (error instanceof NotFoundError): throw error;
                case (error instanceof BadRequestError): throw error;
                case (error instanceof InternalServerError): throw error;
            }
        }
    }

    @Post("/")
    public async createTicket(@RequestScopeContainer() container: ContainerInstance, @Body() body: CreateTicketRequest) {
        try {

            const service = container.get(TicketService);
            const result = await service.create(body);
            return { message: "create success" }
        } catch (error) {
            switch (true) {
                case (error instanceof ApplicationError): throw error;
                case (error instanceof BadRequestError): throw error;
                case (error instanceof InternalServerError): throw error;
                case (error instanceof ForbiddenError): throw error;
            }
        }
    }

    @Patch("/:ticketId")
    public async updateTicket(
        @RequestScopeContainer() container: ContainerInstance,
        @Param("ticketId") ticketId: string,
        @Body() body: UpdateTicketRequest
    ) {
        try {
            const service = container.get(TicketService);
            const result = await service.update(ticketId, body);
            return { message: "update success" }
        } catch (error) {
            switch (true) {
                case (error instanceof NotFoundError): throw error;
                case (error instanceof ApplicationError): throw error;
                case (error instanceof ForbiddenError): throw error;
                case (error instanceof BadRequestError): throw error;
                case (error instanceof InternalServerError): throw error;

            }
        }
    }

    @Patch("/:ticketId/status")
    public async updateTicketStatus(
        @RequestScopeContainer() container: ContainerInstance,
        @Param("ticketId") ticketId: string,
        @Body() body: UpdateTicketStatusRequest
    ) {
        try {
            const service = container.get(TicketService);
            return service.updateStatus(ticketId, body.status);
        } catch (error) {
            switch (true) {
                case (error instanceof NotFoundError): throw error;
                case (error instanceof ApplicationError): throw error;
                case (error instanceof ForbiddenError): throw error;
                case (error instanceof BadRequestError): throw error;
                case (error instanceof InternalServerError): throw error;

            }
        }
    }

    @Delete("/:ticketId")
    public async deleteTicket(@RequestScopeContainer() container: ContainerInstance, @Param("ticketId") ticketId: string) {
        try {
            const service = container.get(TicketService);
            return service.delete(ticketId);
        } catch (error) {
            switch (true) {
                case (error instanceof NotFoundError): throw error;
                case (error instanceof ApplicationError): throw error;
                case (error instanceof ForbiddenError): throw error;
                case (error instanceof BadRequestError): throw error;
                case (error instanceof InternalServerError): throw error;

            }
        }
    }
}
