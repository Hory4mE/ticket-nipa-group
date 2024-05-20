/* eslint-disable prettier/prettier */
import { Expose, IsEnum, IsOptional, IsString } from "@nipacloud/framework/core/util/validator";
import { randomUUID } from "crypto";

import { ITicket } from "@app/data/abstraction/entities/ITickets";
import { TicketStatus } from "../models/Definitions";

export class CreateTicketRequest {
    @Expose({ name: "title" })
    @IsString()
    title: string;

    @Expose({ name: "description" })
    @IsString()
    description: string;

    public toTicketEntity(): ITicket {
        const tickets = {
            ticket_id: randomUUID(),
            title: this.title,
            description: this.description,
            status: TicketStatus.PENDING,
            created_date: new Date(),
            updated_date: new Date(),
            is_delete: false,
            user_id: "",
        };
        return tickets;
    }
}

export class UpdateTicketRequest {
    @Expose({ name: "title" })
    @IsOptional()
    @IsString()
    title: string;

    @Expose({ name: "description" })
    @IsOptional()
    @IsString()
    description: string;

    public toTicketEntity(): Partial<ITicket> {
        const ticket = {
            title: this.title,
            description: this.description,
            updated_date: new Date(),
        };
        return ticket;
    }
}

export class UpdateTicketStatusRequest {
    @Expose({ name: "status" })
    @IsOptional()
    @IsEnum(TicketStatus)
    status: TicketStatus;
}

export interface ICreateTicket {
    ticket_id: string;
    title: string;
    description: string;
    created_date: Date;
    updated_date: Date;
    status: TicketStatus;
    user_id: string;
}
