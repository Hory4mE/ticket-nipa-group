import { AppUnitOfWork } from "@app/data/sql/AppUnitOfWork";
import { AppUnitOfWorkFactory } from "@app/data/sql/AppUnitOfWorkFactory";
import {
    TicketStatusChangedEventIdentifier,
    TicketStatusChangedEventProducer,
} from "@app/modules/messaging/TicketStatusChangedEventProducer";
import { RabbitMQConnector } from "@app/utils/connection/RabbitMQConnector";
import { Container } from "@nipacloud/framework/core/ioc";
import { TicketStatusChangedEventConsumer } from "./TicketStatusChangedEventConsumer";

export class StartTicketStatusChangedEventConsumerCommand {
    public async run() {
        const rabbitMQConnector = new RabbitMQConnector({
            hostname: "localhost",
        });
        await rabbitMQConnector.connect();

        const ticketStatusChangedProducer = new TicketStatusChangedEventProducer(rabbitMQConnector);

        Container.set(AppUnitOfWork, AppUnitOfWorkFactory);
        Container.set(TicketStatusChangedEventIdentifier, ticketStatusChangedProducer);

        const ticketStatusChangedEventConsumer = new TicketStatusChangedEventConsumer(rabbitMQConnector);
        await ticketStatusChangedEventConsumer.init();
    }
}
