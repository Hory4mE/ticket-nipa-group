import { RabbitMQConnector } from "@app/utils/connection/RabbitMQConnector";
import { IRabbitMQCommiter, RabbitMQConsumer } from "@app/utils/message/RabbitMQConsumer";
import { Options } from "amqplib";
import axios from "axios";
import { IActionUpdateStatus } from "../../tickets/dto/TicketResponse";

export class TicketStatusChangedEventConsumer extends RabbitMQConsumer<IActionUpdateStatus> {
    public routingKeys: string[] = ["update-ticket-status"];
    public queue: string = "ticket.status";
    public exchange: string = "heldesk-ticket";
    constructor(connector: RabbitMQConnector) {
        super(connector);
    }

    public messageDeserializer = (raw: Buffer) => {
        return JSON.parse(raw.toString()) as IActionUpdateStatus;
    };

    public async onUnsubscribed(): Promise<void> {}
    public async onMessage(message: IActionUpdateStatus, committer?: IRabbitMQCommiter): Promise<void> {
        if (message) {
            await axios.post("https://webhook.site/6d39a67e-deec-431c-b8fc-d1e9aecf0f89", message);
        }
    }

    public async onError(error: Error): Promise<void> {
        console.log(`[TicketStatusChangeEventConsumer]`, "error:", error);
    }

    public subscriptionOption(): Options.Consume {
        const option: Options.Consume = { consumerTag: `worker:${this.constructor.name}@${process.env.WORKER_NAME}` };
        return option;
    }
}
