import "reflect-metadata";

import * as DotEnv from "dotenv";

import { Application } from "./Application";
import { authorizationChecker } from "./middlewares/AuthenticationMiddleware";
import { StartTicketStatusChangedEventConsumerCommand } from "./modules/aggregate-ticket/ticket-status-change/StartTicketStatusChangedEventConsumerCommand";

DotEnv.config();
export class Main extends Application {
    public ticketStatusChangedEventConsumer: StartTicketStatusChangedEventConsumerCommand;

    async start(): Promise<void> {
        if (this.arguments["api"]) {
            const app = new Application();
            const port = parseInt(process.env.PORT || "5500");
            app.start(port);
            app.useServer({
                cors: true,
                authorizationChecker,
            });
        }

        if (this.arguments["consumer"]) {
            console.log("Ticket status change consumer");
            this.ticketStatusChangedEventConsumer = new StartTicketStatusChangedEventConsumerCommand();
            await this.ticketStatusChangedEventConsumer.run();
        }
    }
}

new Main().start();
