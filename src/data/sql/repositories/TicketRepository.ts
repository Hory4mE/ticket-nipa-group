/* eslint-disable prettier/prettier */
import { DatabaseRepository } from "@nipacloud/framework/data/sql";

import { ITicket } from "@app/data/abstraction/entities/ITickets";
import { ICreateTicket } from "@app/modules/tickets/dto/TicketRequest";
import { TicketQueryOption } from "@app/modules/tickets/query/TicketQueryOption";

export interface ITicketRepository {
    list(option: TicketQueryOption): Promise<ITicket[]>;
    findById(id: string): Promise<ITicket>;
    create(room: ICreateTicket): Promise<void>;
    updateById(id: string, room: Partial<ITicket>): Promise<void>;
    deleteById(id: string): Promise<void>;
}

export class TicketRepository extends DatabaseRepository<ITicket> implements ITicketRepository {
    protected tableName: string = "tickets";

    async list(option: TicketQueryOption): Promise<ITicket[]> {
        return this.executeQuery((query) => {
            const { status, paginationQuery, sort_by, user_id } = option;
            if (status.length > 0) {
                query.whereIn("status", status);
            }
            if (paginationQuery) {
                query.offset(paginationQuery.offset).limit(paginationQuery.limit);
            }
            if (sort_by.sortBy.length != 0) {
                const res = JSON.parse(sort_by.sortBy.toString());
                res.map((data: any) => {
                    if (data.field && data.direction) {
                        query.orderBy(data.field, data.direction);
                    }
                });
            }
            if (user_id) {
                query.where("user_id", user_id);
            }
            query.where("is_delete", false);
            return query;
        });
    }

    async findById(id: string): Promise<ITicket> {
        return this.first((query) => query.where("ticket_id", id));
    }

    async create(ticket: ICreateTicket): Promise<void> {
        const Ticket = { ...ticket, is_delete: false };
        return this.add(Ticket);
    }

    async updateById(id: string, ticket: Partial<ITicket>): Promise<void> {
        const partialEntity = { ...ticket, updated_date: new Date() };
        return this.update(partialEntity, (query) => query.where("ticket_id", id));
    }

    async deleteById(id: string): Promise<void> {
        return this.update({ is_delete: true }, (query) => query.where("ticket_id", id));
    }
}
