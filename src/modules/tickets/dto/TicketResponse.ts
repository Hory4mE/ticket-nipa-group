import { UserRoles } from "@app/modules/users/model/Defination";
import { TicketStatus } from "../models/Definitions";

export interface IActionUpdateStatus {
    actor: {
        username: string;
        roles: UserRoles;
    };
    ticket: {
        ticketId: string;
        title: string;
        old_status: TicketStatus;
        new_status: TicketStatus;
        update_at: Date;
    };
    relate_personal: {
        username: string;
        fullname: string;
        email: string;
        roles: UserRoles;
    };
}
