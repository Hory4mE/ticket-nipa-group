/* eslint-disable prettier/prettier */
import {
    createSortingConditionValidator,
    Expose,
    IsEnum,
    IsOptional,
    ISortingConditionType,
} from "@nipacloud/framework/core/util/validator";

import { ITicket } from "@app/data/abstraction/entities/ITickets";
import { TicketStatus } from "../models/Definitions";

const { SortingConditionTransformer } = createSortingConditionValidator("ticket_id");

export class IListTicketQueryParameter {
    @IsEnum(TicketStatus)
    @IsOptional()
    public readonly status?: TicketStatus;

    @Expose({ name: "sort_by" })
    @IsOptional()
    public sortBy?: ISortingConditionType<ITicket>[];

    @Expose({ name: "user_id" })
    @IsOptional()
    public user_id?: string;
}
