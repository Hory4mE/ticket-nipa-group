import { Expose, IsOptional } from "@nipacloud/framework/core/util/validator";

export class IUserHeader {
    @Expose({ name: "token" })
    @IsOptional()
    public token: string;
}
