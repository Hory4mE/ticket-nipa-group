import { Expose, IsOptional } from "@nipacloud/framework/core/util/validator";

export class IListUserQueryParameter {
  // @IsEnum(TicketStatus)
  // @IsOptional()
  // public readonly status?: TicketStatus;

  @Expose({ name: "username" })
  @IsOptional()
  username?: string;
}
