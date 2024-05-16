/* eslint-disable prettier/prettier */
import { ITicket } from "@app/data/abstraction/entities/ITickets";
import { TicketStatus } from "@app/modules/tickets/models/Definitions";
import {
  PaginationQuery,
  PaginationQueryMaker,
} from "../../../query/PaginationQuery";
import { IListTicketQueryParameter } from "./ListTicketQueryParameter";

export interface TicketQueryOption {
  status?: TicketStatus[];
  paginationQuery?: PaginationQuery<ITicket>;
  sort_by?: IListTicketQueryParameter;
}

export class TicketQueryOptionMaker {
  static fromRoomListQueryParams(params: IListTicketQueryParameter) {
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
    return option;
  }
}
