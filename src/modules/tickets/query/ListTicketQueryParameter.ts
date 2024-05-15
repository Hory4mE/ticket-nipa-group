/* eslint-disable prettier/prettier */
import {
    createSortingConditionValidator,
    Expose,
    IsEnum,
    IsOptional,
    ISortingConditionType
} from "@nipacloud/framework/core/util/validator";

import { ITicket } from "@app/data/abstraction/entities/ITickets";
import { TicketStatus } from "../models/Definitions";

const { SortingConditionTransformer } = createSortingConditionValidator("created_at");

export class IListTicketQueryParameter {
    @IsEnum(TicketStatus)
    @IsOptional()
    public readonly status?: TicketStatus;

    @IsOptional()
    // @IsArray()
    @Expose({ name: "sort_by" })
    // @Transform(SortingConditionTransformer, { toClassOnly: true })
    public sortBy?: ISortingConditionType<ITicket>[];
}
