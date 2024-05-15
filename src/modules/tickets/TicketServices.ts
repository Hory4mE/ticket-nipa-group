/* eslint-disable prettier/prettier */
import { IAppUnitOfWork } from "@app/data/abstraction/IAppUnitOfWork";
import { AppUnitOfWorkFactoryIdentifier, IAppUnitOfWorkFactory } from "@app/data/abstraction/IAppUnitOfWorkFactory";
import { ITicket } from "@app/data/abstraction/entities/ITickets";
import { TicketQueryOptionMaker } from "@app/modules/tickets/query/TicketQueryOption";
import { using } from "@nipacloud/framework/core/disposable";
import { Inject, Service } from "@nipacloud/framework/core/ioc";
import { CreateTicketRequest, UpdateTicketRequest } from "./dto/TicketRequest";
import { TicketStatus } from "./models/Definitions";
import { IListTicketQueryParameter } from "./query/ListTicketQueryParameter";

 
@Service()

export class TicketService{
    @Inject(AppUnitOfWorkFactoryIdentifier)
    private unitOfWorkFactory: IAppUnitOfWorkFactory;

    public async list(params: IListTicketQueryParameter): Promise<ITicket[]> {
        return using(this.unitOfWorkFactory.create())((uow: IAppUnitOfWork) => {
            const option = TicketQueryOptionMaker.fromRoomListQueryParams(params);
            return uow.ticketRepository.list(option);
        });
    }
    public async getById(ticketId: string): Promise<ITicket> {
        return using(this.unitOfWorkFactory.create())((uow: IAppUnitOfWork) => {
            return uow.ticketRepository.findById(ticketId);
        });
    }
    public async create(body: CreateTicketRequest): Promise<void> {
        return using(this.unitOfWorkFactory.create())((uow: IAppUnitOfWork) => {
            const entity = body.toTicketEntity();
            return uow.ticketRepository.create(entity);
        });
    }

    public async update(ticketId: string, body: UpdateTicketRequest): Promise<void> {
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            const entity = body.toTicketEntity();
            return uow.ticketRepository.updateById(ticketId, entity);
        });
    }

    public async updateStatus(ticketId: string, status: TicketStatus): Promise<void> {
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            return uow.ticketRepository.updateById(ticketId, { status });
        });
    }

    public async delete(ticketId: string) {
        return using(this.unitOfWorkFactory.create())(async (uow: IAppUnitOfWork) => {
            return uow.ticketRepository.deleteById(ticketId);
        });
    }
}