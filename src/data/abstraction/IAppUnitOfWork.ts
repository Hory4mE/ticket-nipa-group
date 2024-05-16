import { IUnitOfWork } from "@nipacloud/framework/data/patterns";
import { ITicketRepository } from "../sql/repositories/TicketRepository";
import { IUserRepository } from "../sql/repositories/UserRepository";

export interface IAppUnitOfWork extends IUnitOfWork {
  // readonly roomRepository: IRoomRepository;
  // readonly reservationRepository: IReservationRepository;
  readonly ticketRepository: ITicketRepository;
  readonly userRepository: IUserRepository;
}
