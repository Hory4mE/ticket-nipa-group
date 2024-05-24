import { RabbitMQConnector } from "@app/utils/connection/RabbitMQConnector";
import { TicketStatusChangedEventConsumer } from "./TicketStatusChangedEventConsumer";

export class StartTicketStatusChangedEventConsumerCommand {
    public async run() {
        const rabbitMQConnector = new RabbitMQConnector({
            hostname: process.env.RABBITMQ_HOST,
        });
        await rabbitMQConnector.connect();

        // const ticketStatusChangedProducer = new TicketStatusChangedEventProducer(rabbitMQConnector);

        // Container.set(AppUnitOfWork, AppUnitOfWorkFactory);
        // Container.set(TicketStatusChangedEventIdentifier, ticketStatusChangedProducer);

        const ticketStatusChangedEventConsumer = new TicketStatusChangedEventConsumer(rabbitMQConnector);
        await ticketStatusChangedEventConsumer.init();
    }
}
