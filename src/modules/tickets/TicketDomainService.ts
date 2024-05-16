// import { ITicket } from "@app/data/abstraction/entities/ITicket";
import { ITicket } from "@app/data/abstraction/entities/ITickets";
import { IAppUnitOfWork } from "@app/data/abstraction/IAppUnitOfWork";
// import { RoomQueryOption } from "@app/modules/rooms/query/RoomQueryOption";
// import { NotFoundError } from "@nipacloud/framework/core/http";
import { Service } from "@nipacloud/framework/core/ioc";
import { ICreateTicket } from "./dto/TicketRequest";
import { TicketQueryOption } from "./query/TicketQueryOption";

@Service()
export class TicketDomainService {
  public async create(uow: IAppUnitOfWork, body: ICreateTicket): Promise<void> {
    const room = await uow.ticketRepository.create(body);
    return room;
  }

  public async list(
    uow: IAppUnitOfWork,
    option: TicketQueryOption
  ): Promise<ITicket[]> {
    return uow.ticketRepository.list(option);
  }

  public async findById(uow: IAppUnitOfWork, id: string): Promise<ITicket> {
    const room = await uow.ticketRepository.findById(id);
    // if (!room) {
    //     throw new NotFoundError("Ticket not found");
    // }

    return room;
  }

  public async update(
    uow: IAppUnitOfWork,
    ticketId: string,
    entity: Partial<ITicket>
  ): Promise<void> {
    const room = await uow.ticketRepository.findById(ticketId);
    // if (!room) {
    //     throw new NotFoundError("Ticket not found");
    // }
    const updatedRoom = uow.ticketRepository.updateById(ticketId, entity);
    return updatedRoom;
  }

  public async delete(uow: IAppUnitOfWork, ticketId: string): Promise<void> {
    const room = await uow.ticketRepository.findById(ticketId);
    // if (!room) {
    //     throw new NotFoundError("Ticket not found");
    // }
    return uow.ticketRepository.deleteById(ticketId);
  }
}
