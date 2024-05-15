/* eslint-disable prettier/prettier */
import {
    createSortingConditionValidator,
    Expose,
    IsEnum,
    IsOptional,
    ISortingConditionType,
    Transform
} from "@nipacloud/framework/core/util/validator";

import { ITicket } from "@app/data/abstraction/entities/ITickets";
import { TicketStatus } from "../models/Definitions";

const { SortingConditionTransformer } = createSortingConditionValidator("ticket_id");

export class IListTicketQueryParameter {
    @IsEnum(TicketStatus)
    @IsOptional()
    public readonly status?: TicketStatus;

    @IsOptional()
    // @IsArray()
    @Expose({ name: "sort_by" })
    @Transform(({value}) => JSON.parse(value))
    public sortBy?: ISortingConditionType<ITicket>[];
}
