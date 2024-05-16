import { Expose, IsOptional } from "@nipacloud/framework/core/util/validator";

export class ITicketHeader {
    @Expose({ name: "token" })
    @IsOptional()
    public token: string;
}
