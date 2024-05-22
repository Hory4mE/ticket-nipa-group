import {
    ErrorResponderMiddleware,
    RequestContainerLifeCycleMiddleware,
    RequestIdGeneratorMiddleware,
    RequestLoggerMiddleware,
    RoutingControllersOptions,
} from "@nipacloud/framework/core/http";
import { HttpApplication } from "@nipacloud/framework/core/http/HttpApplication";
import { Container } from "@nipacloud/framework/core/ioc";
import { RequestScopeInjectionMiddleware } from "./middlewares/RequestScopeInjectionMiddleware";
import {
    TicketStatusChangedEventIdentifier,
    TicketStatusChangedEventProducer,
} from "./modules/messaging/TicketStatusChangedEventProducer";
import { TicketController } from "./modules/tickets/TicketController";
import { UserController } from "./modules/users/UserController";
import { RabbitMQConnector, RabbitMQConnectorIdentifier } from "./utils/connection/RabbitMQConnector";

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
        const rabbitMQConnector = new RabbitMQConnector({
            hostname: "localhost",
        });
        await rabbitMQConnector.connect();

        const ticketStatusChangedEventProducer = new TicketStatusChangedEventProducer(rabbitMQConnector);

        Container.set(RabbitMQConnectorIdentifier, rabbitMQConnector);
        Container.set(TicketStatusChangedEventIdentifier, ticketStatusChangedEventProducer);
        super.start(port);
    }
    public async useServer(options: RoutingControllersOptions): Promise<void> {
        super.useServer(options);
    }
}
