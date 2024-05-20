/* eslint-disable prettier/prettier */
import { ITicket } from "@app/data/abstraction/entities/ITickets";
import { TicketStatus } from "@app/modules/tickets/models/Definitions";
import { PaginationQuery, PaginationQueryMaker } from "../../../query/PaginationQuery";
import { IListTicketQueryParameter } from "./ListTicketQueryParameter";

export interface TicketQueryOption {
    status?: TicketStatus[];
    paginationQuery?: PaginationQuery<ITicket>;
    sort_by?: IListTicketQueryParameter;
    user_id?: string;
}

export class TicketQueryOptionMaker {
    static fromTicketListQueryParams(params: IListTicketQueryParameter) {
        const option: TicketQueryOption = {};
        option.paginationQuery = PaginationQueryMaker.make(params);
        if (params.status) {
            option.status = [params.status];
        } else {
            option.status = [];
        }
        if (params.sortBy) {
            option.sort_by = { sortBy: params.sortBy };
        } else {
            option.sort_by = { sortBy: [] };
        }
        if (params.user_id) {
            option.user_id = params.user_id;
            console.log("userid", params.user_id);
            console.log("optiin", option.user_id);
        } else {
            option.user_id = "";
        }
        return option;
    }
}
