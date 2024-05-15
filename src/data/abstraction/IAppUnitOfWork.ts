import { IUnitOfWork } from "@nipacloud/framework/data/patterns";
import { ITicketRepository } from "../sql/repositories/TicketRepository";

export interface IAppUnitOfWork extends IUnitOfWork {
    // readonly roomRepository: IRoomRepository;
    // readonly reservationRepository: IReservationRepository;
    readonly ticketRepository: ITicketRepository;
}
