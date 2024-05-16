/* eslint-disable prettier/prettier */
import { IAppUnitOfWork } from "@app/data/abstraction/IAppUnitOfWork";
import {
    AppUnitOfWorkFactoryIdentifier,
    IAppUnitOfWorkFactory,
} from "@app/data/abstraction/IAppUnitOfWorkFactory";
import { ITicket } from "@app/data/abstraction/entities/ITickets";
import { TicketQueryOptionMaker } from "@app/modules/tickets/query/TicketQueryOption";
import { using } from "@nipacloud/framework/core/disposable";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "@nipacloud/framework/core/http";
import { Inject, Service } from "@nipacloud/framework/core/ioc";
import jwt from "jsonwebtoken";
import { TicketDomainService } from "./TicketDomainService";
import { CreateTicketRequest, UpdateTicketRequest } from "./dto/TicketRequest";
import { TicketStatus } from "./models/Definitions";
import { IListTicketQueryParameter } from "./query/ListTicketQueryParameter";
import { ITicketHeader } from "./query/TicketHeader";

@Service()
export class TicketService {
    @Inject(AppUnitOfWorkFactoryIdentifier)
    private unitOfWorkFactory: IAppUnitOfWorkFactory;

    @Inject()
    private ticketDomainService: TicketDomainService;

    public async list(params: IListTicketQueryParameter): Promise<ITicket[]> {
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            const option = TicketQueryOptionMaker.fromTicketListQueryParams(params);
            const tickets = await this.ticketDomainService.list(uow, option);
            if (!tickets) {
                throw new NotFoundError("Ticket not found !");
            } else {
                return tickets;
            }

        });
    }
    public async getById(ticketId: string): Promise<ITicket> {
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            const tickets = await this.ticketDomainService.findById(uow, ticketId);
            return tickets;
        });
    }
    public async create(body: CreateTicketRequest): Promise<void> {
        return using(this.unitOfWorkFactory.create())((uow: IAppUnitOfWork) => {
            const entity = body.toTicketEntity();
            return this.ticketDomainService.create(uow, entity);
        });
    }

    public async update(
        ticketId: string,
        body: UpdateTicketRequest,
        header: ITicketHeader
    ): Promise<void> {
        return using(this.unitOfWorkFactory.create())(
            async (uow: IAppUnitOfWork) => {
                const receivedToken = header.token;
                if (!receivedToken) {
                    throw new UnauthorizedError("No token provided");
                }



                const decoded: any = jwt.verify(receivedToken, process.env.SECRET);
                const userRoles = decoded.roles || [];
                const allowedRoles = ['USER'];

                console.log(decoded.roles)
                const hasAccess = allowedRoles.includes(decoded.roles);

                if (!hasAccess) {
                    throw new UnauthorizedError("You don't have permission for this action!")
                }

                const userTicket = this.ticketDomainService.findById(uow, ticketId);
                if (!userTicket) {
                    throw new NotFoundError("Ticket Not Found");
                }

                const receivedId = decoded.user_id;
                console.log(decoded.user_id);
                console.log(userTicket);
                if (!((await userTicket).user_id == receivedId)) {
                    throw new UnauthorizedError("This Ticket is not Yours!")
                }

                if (!((await userTicket).status == TicketStatus.PENDING)) {
                    throw new UnauthorizedError("Cannot change anything after the admin operating your tickets.")
                }

                const entity = body.toTicketEntity();
                return this.ticketDomainService.update(uow, ticketId, entity);
            }
        );
    }

    public async updateStatus(
        ticketId: string,
        status: TicketStatus,
        header: ITicketHeader
    ): Promise<void> {
        return using(this.unitOfWorkFactory.create())(
            async (uow: IAppUnitOfWork) => {
                const ticket = await this.ticketDomainService.findById(uow, ticketId);

                const receivedToken = header.token;
                if (!receivedToken) {
                    throw new UnauthorizedError("No token provided");
                }

                const decoded: any = jwt.verify(receivedToken, process.env.SECRET);
                const userRoles = decoded.roles || [];
                const allowedRoles = ['USER'];

                console.log(decoded.roles)
                const hasAccess = allowedRoles.includes(decoded.roles);

                if (!hasAccess) {
                    throw new UnauthorizedError("You don't have permission for this action!")
                }

                if (!ticket) {
                    throw new NotFoundError("Ticket Not Found");
                }

                if (status) { // Check if user provides a status
                    if (
                        ticket.status === TicketStatus.PENDING &&
                        (status === TicketStatus.IN_PROGRESS ||
                            status === TicketStatus.CANCELLED)
                    ) {
                        this.ticketDomainService.update(uow, ticketId, { status });
                    } else if (
                        ticket.status === TicketStatus.IN_PROGRESS &&
                        status === TicketStatus.COMPLETED
                    ) {
                        this.ticketDomainService.update(uow, ticketId, { status });
                    } else {
                        throw new ForbiddenError("Invalid status transition or ticket status cannot be changed")
                    }
                } else {
                    throw new NotFoundError("No Status provided for updates...");
                }


            }
        );
    }

    public async delete(ticketId: string) {
        return using(this.unitOfWorkFactory.create())(
            async (uow: IAppUnitOfWork) => {
                return this.ticketDomainService.delete(uow, ticketId);
            }
        );
    }
}
