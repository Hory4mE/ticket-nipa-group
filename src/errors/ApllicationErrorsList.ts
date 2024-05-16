import { ApplicationError } from "@nipacloud/framework/core/error";

export class TicketNotFoundError extends ApplicationError {
    constructor(message = "Ticket not found") {
        super(message);
    }
}

export class UpdateTicketStatusError extends ApplicationError {
    constructor(message: string) {
        super(message);
    }
}
