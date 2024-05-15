/* eslint-disable prettier/prettier */
import { TicketStatus } from "@app/modules/tickets/models/Definitions";

export interface ITicket {
    ticket_id: string;
    title: string;
    description: string;
    status: TicketStatus;
    created_date: Date;
    updated_date: Date;
    is_delete: boolean;
}