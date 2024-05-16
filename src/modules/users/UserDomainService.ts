import { IUser } from "@app/data/abstraction/entities/IUsers";
import { IAppUnitOfWork } from "@app/data/abstraction/IAppUnitOfWork";
import { Service } from "@nipacloud/framework/core/ioc";
import { UserQueryOption } from "./query/UserQueryOption";
// import { ICreateTicket } from "./dto/TicketRequest";
// import { TicketQueryOption } from "./query/TicketQueryOption";

@Service()
export class UserDomainService {
  public async create(uow: IAppUnitOfWork, body: IUser): Promise<void> {
    const room = await uow.userRepository.create(body);
    return room;
  }

  public async list(
    uow: IAppUnitOfWork,
    option: UserQueryOption
  ): Promise<IUser[]> {
    return uow.userRepository.list(option);
  }

  public async findById(uow: IAppUnitOfWork, id: string): Promise<IUser> {
    const room = await uow.userRepository.findById(id);
    return room;
  }

  public async update(
    uow: IAppUnitOfWork,
    ticketId: string,
    entity: Partial<IUser>
  ): Promise<void> {
    const room = await uow.userRepository.findById(ticketId);
    const updatedRoom = uow.userRepository.updateById(ticketId, entity);
    return updatedRoom;
  }

  public async delete(uow: IAppUnitOfWork, ticketId: string): Promise<void> {
    const room = await uow.userRepository.findById(ticketId);
    return uow.userRepository.deleteById(ticketId);
  }
}
