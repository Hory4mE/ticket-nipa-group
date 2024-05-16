import { HttpError } from "@nipacloud/framework/core/http";

export class CustomHttpError extends HttpError {
    name: string;
    constructor(status: number, message: string, name: string) {
        super(status, message);
        this.name = name;
    }
}
