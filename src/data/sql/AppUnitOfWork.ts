import { Database, DatabaseUnitOfWork } from "@nipacloud/framework/data/sql";
import { IAppUnitOfWork } from "../abstraction/IAppUnitOfWork";
import {
  ITicketRepository,
  TicketRepository,
} from "./repositories/TicketRepository";
import { IUserRepository, UserRepository } from "./repositories/UserRepository";

export class AppUnitOfWork
  extends DatabaseUnitOfWork
  implements IAppUnitOfWork
{
  // roomRepository: IRoomRepository;
  // reservationRepository: IReservationRepository;
  ticketRepository: ITicketRepository;
  userRepository: IUserRepository;
  constructor(connection: Database) {
    super(connection);
    // this.roomRepository = new RoomRepository(this);
    // this.reservationRepository = new ReservationRepository(this);
    this.ticketRepository = new TicketRepository(this);
    this.userRepository = new UserRepository(this);
  }
}
