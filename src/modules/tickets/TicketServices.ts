/* eslint-disable prettier/prettier */
import { IAppUnitOfWork } from "@app/data/abstraction/IAppUnitOfWork";
import { AppUnitOfWorkFactoryIdentifier, IAppUnitOfWorkFactory } from "@app/data/abstraction/IAppUnitOfWorkFactory";
import { ITicket } from "@app/data/abstraction/entities/ITickets";
import { TicketQueryOptionMaker } from "@app/modules/tickets/query/TicketQueryOption";
import { using } from "@nipacloud/framework/core/disposable";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "@nipacloud/framework/core/http";
import { Inject, Service } from "@nipacloud/framework/core/ioc";
import jwt, { TokenExpiredError } from "jsonwebtoken";
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

    public async list(params: IListTicketQueryParameter, header: ITicketHeader): Promise<ITicket[]> {
        // const token: any = jwt.verify(header.token, process.env.SECRET);
        const token: any = jwt.verify(header.token, process.env.SECRET, (error, token) => {
            if (error) {
                // console.error("error", error);
                throw error;
            }
            console.log("token", token);
            return token;
        });
        if (!token || token.exp) {
            console.log(token.exp);
            throw new TokenExpiredError("token expired", new Date());
        }
        const allowRoles = ["ADMIN", "REVIEWER"];
        const hasAccess = allowRoles.includes(token.roles);
        if (!hasAccess) {
            throw new UnauthorizedError("Invalid Token.");
        }
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
    public async getById(ticketId: string, header: ITicketHeader): Promise<ITicket> {
        const token: any = jwt.verify(header.token, process.env.SECRET);
        const allowRoles = ["ADMIN", "REVIEWER"];
        const allowRolesUser = ["USER"];
        const hasAccessAll = allowRoles.includes(token.roles);
        const hasAccessSelf = allowRolesUser.includes(token.roles);
        if (!hasAccessAll && !hasAccessSelf) {
            throw new UnauthorizedError("Invalid Token.");
        }
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            const tickets = await this.ticketDomainService.findById(uow, ticketId);
            if (hasAccessSelf) {
                if (tickets.user_id != token.user_id) {
                    throw new UnauthorizedError("Invalid Token.");
                }
            }
            return tickets;
        });
    }
    public async create(body: CreateTicketRequest, header: ITicketHeader): Promise<void> {
        const entity = body.toTicketEntity();
        const token: any = jwt.verify(header.token, process.env.SECRET);
        const newTicket = { ...entity, user_id: token.user_id };
        const allowedRoles = ["USER", "ADMIN"];
        const hasAccess = allowedRoles.includes(token.roles);
        if (!hasAccess) {
            throw new UnauthorizedError("Invalid Token.");
        }
        return using(this.unitOfWorkFactory.create())((uow: IAppUnitOfWork) => {
            return this.ticketDomainService.create(uow, newTicket);
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
                const allowedRoles = ['ADMIN'];

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

    public async delete(ticketId: string, header: ITicketHeader) {
        const token: any = jwt.verify(header.token, process.env.SECRET);
        const accessRoles = ["USER"];
        const hasAccess = accessRoles.includes(token.roles);
        console.log(token);
        if (!hasAccess) {
            throw new UnauthorizedError("Invalid Token.");
        }
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            const ticket = await this.ticketDomainService.findById(uow, ticketId);
            if (!ticket) {
                throw new NotFoundError("Ticket not found!");
            } else if (ticket.user_id != token.user_id) {
                throw new UnauthorizedError("Invalid Token.");
            }
            return this.ticketDomainService.delete(uow, ticketId);
        });
    }
}
