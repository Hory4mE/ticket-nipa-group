/* eslint-disable prettier/prettier */
import { IAppUnitOfWork } from "@app/data/abstraction/IAppUnitOfWork";
import { AppUnitOfWorkFactoryIdentifier, IAppUnitOfWorkFactory } from "@app/data/abstraction/IAppUnitOfWorkFactory";
import { ITicket } from "@app/data/abstraction/entities/ITickets";
import { TicketQueryOptionMaker } from "@app/modules/tickets/query/TicketQueryOption";
import { using } from "@nipacloud/framework/core/disposable";
import { NotFoundError, UnauthorizedError } from "@nipacloud/framework/core/http";
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

    public async list(params: IListTicketQueryParameter, header: ITicketHeader): Promise<ITicket[]> {
        const token: any = jwt.verify(header.token, process.env.JWT_ACCESS_SECRET);
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
        const token: any = jwt.verify(header.token, process.env.JWT_ACCESS_SECRET);
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

    public async update(ticketId: string, body: UpdateTicketRequest): Promise<void> {
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            const entity = body.toTicketEntity();
            return this.ticketDomainService.update(uow, ticketId, entity);
        });
    }

    public async updateStatus(ticketId: string, status: TicketStatus): Promise<void> {
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            return this.ticketDomainService.update(uow, ticketId, { status });
        });
    }

    public async delete(ticketId: string) {
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            return this.ticketDomainService.delete(uow, ticketId);
        });
    }
}
