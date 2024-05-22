import { RabbitMQConnector } from "@app/utils/connection/RabbitMQConnector";
import { TicketStatusChangedEventConsumer } from "./TicketStatusChangedEventConsumer";

export class StartTicketStatusChangedEventConsumerCommand {
    public async run() {
        const rabbitMQConnector = new RabbitMQConnector({
            hostname: "localhost",
        });
        await rabbitMQConnector.connect();

        const ticketStatusChangedEventConsumer = new TicketStatusChangedEventConsumer(rabbitMQConnector);
        await ticketStatusChangedEventConsumer.init();
    }
}
