import {
    ErrorResponderMiddleware,
    RequestContainerLifeCycleMiddleware,
    RequestIdGeneratorMiddleware,
    RequestLoggerMiddleware,
    RoutingControllersOptions,
} from "@nipacloud/framework/core/http";
import { HttpApplication } from "@nipacloud/framework/core/http/HttpApplication";
import { connectRedis } from "./config/redis";
import { RequestScopeInjectionMiddleware } from "./middlewares/RequestScopeInjectionMiddleware";
import { TicketController } from "./modules/tickets/TicketController";
import { UserController } from "./modules/users/UserController";
import Consumer from "./rabbit/Consumer";

export class Application extends HttpApplication {
    constructor() {
        super();

        this.useMiddleware(RequestIdGeneratorMiddleware);
        this.useMiddleware(RequestContainerLifeCycleMiddleware);
        this.useMiddleware(RequestLoggerMiddleware);
        this.useMiddleware(RequestScopeInjectionMiddleware);
        this.useMiddleware(ErrorResponderMiddleware);

        this.useController(TicketController);
        this.useController(UserController);
    }

    public async start(port: number): Promise<void> {
        if (this.arguments["api"]) {
            await connectRedis();
            super.start(port);
        } else if (this.arguments["consumer"]) {
            Consumer();
        } else {
            console.log("provide me more man!");
        }
    }
    public async useServer(options: RoutingControllersOptions): Promise<void> {
        super.useServer(options);
    }
}
