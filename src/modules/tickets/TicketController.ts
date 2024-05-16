import {
    Body,
    Delete,
    Get,
    InternalServerError,
    JsonController,
    NotFoundError,
    Param,
    Patch,
    Post,
    QueryParams,
    RequestScopeContainer
} from "@nipacloud/framework/core/http";
import { ContainerInstance } from "@nipacloud/framework/core/ioc";
import "reflect-metadata";
import { TicketService } from "./TicketServices";
import { CreateTicketRequest, UpdateTicketRequest, UpdateTicketStatusRequest } from "./dto/TicketRequest";
import { IListTicketQueryParameter } from "./query/ListTicketQueryParameter";

@JsonController("/v1/tickets")
export class TicketController {
    @Get("/")
    public async listTickets(
        @RequestScopeContainer() container: ContainerInstance,
        @QueryParams() queryParam: IListTicketQueryParameter
    ) {
        try {
            const service = container.get(TicketService);
            return service.list(queryParam);
        } catch (error) {
            switch(true){
                case(error instanceof NotFoundError):throw error;
                case(error instanceof InternalServerError):throw error;
            }
        }
    }

    @Get("/:ticketId")
    public async getTicketById(@RequestScopeContainer() container: ContainerInstance, @Param("ticketId") ticketId: string) {
        const service = container.get(TicketService);
        return service.getById(ticketId);
    }

    @Post("/")
    public async createTicket(@RequestScopeContainer() container: ContainerInstance, @Body() body: CreateTicketRequest) {
        const service = container.get(TicketService);
        const result = await service.create(body);
        return { message: "create success" }
    }

    @Patch("/:ticketId")
    public async updateTicket(
        @RequestScopeContainer() container: ContainerInstance,
        @Param("ticketId") ticketId: string,
        @Body() body: UpdateTicketRequest
    ) {
        const service = container.get(TicketService);
        const result = await service.update(ticketId, body);
        return { message: "update success" }
    }

    @Patch("/:ticketId/status")
    public async updateTicketStatus(
        @RequestScopeContainer() container: ContainerInstance,
        @Param("ticketId") ticketId: string,
        @Body() body: UpdateTicketStatusRequest
    ) {
        const service = container.get(TicketService);
        return service.updateStatus(ticketId, body.status);
    }

    @Delete("/:ticketId")
    public async deleteTicket(@RequestScopeContainer() container: ContainerInstance, @Param("ticketId") ticketId: string) {
        const service = container.get(TicketService);
        return service.delete(ticketId);
    }
}