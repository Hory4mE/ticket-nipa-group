/* eslint-disable prettier/prettier */
import { DatabaseRepository } from "@nipacloud/framework/data/sql";

import { ITicket } from "@app/data/abstraction/entities/ITickets";
import { TicketQueryOption } from "@app/modules/tickets/query/TicketQueryOption";

export interface ITicketRepository {
    list(option: TicketQueryOption): Promise<ITicket[]>;
    findById(id: string): Promise<ITicket>;
    create(room: ITicket): Promise<void>;
    updateById(id: string, room: Partial<ITicket>): Promise<void>;
    deleteById(id: string): Promise<void>;
}

export class TicketRepository extends DatabaseRepository<ITicket> implements ITicketRepository {
    protected tableName: string = "tickets";

    async list(option: TicketQueryOption): Promise<ITicket[]> {
        return this.executeQuery((query) => {
            const { status, paginationQuery , sort_by} = option;
            if (status.length > 0) {
                query.whereIn("status", status);
            }
            if (paginationQuery) {
                query.offset(paginationQuery.offset).limit(paginationQuery.limit);
            }
            if(sort_by){
                console.log(sort_by.sortBy)
                // break a sec
                const sort = sort_by.sortBy
                sort.map((data)=>{
                    console.log(typeof data);
                    if(data.field && data.direction){
                        query.orderBy(data.field, data.direction)
                    }
                })
                // query.orderBy(sort_by.forEach(sortOption => {
                //     if(sortOption.field && sortOption.direction){
                //         query.orderBy(sortOption.field, sortOption.direction)
                //     }
                // }))
            }
            return query;
        });
    }

    async findById(id: string): Promise<ITicket> {
        return this.first((query) => query.where("id", id));
    }

    async create(ticket: ITicket): Promise<void> {
        return this.add(ticket);
    }

    async updateById(id: string, ticket: Partial<ITicket>): Promise<void> {
        const partialEntity = { ...ticket, updated_at: new Date() };
        return this.update(partialEntity, (query) => query.where("ticket_id", id));
    }

    async deleteById(id: string): Promise<void> {
        return this.update({ "is_delete": true }, (query) => query.where("ticket_id", id));
    }
}
