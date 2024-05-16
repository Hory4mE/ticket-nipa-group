import { ApplicationError } from "@nipacloud/framework/core/error";

export class UpdateTicketStatusError extends ApplicationError {
    constructor(message: string) {
        super(message);
    }
}
