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
            try {
                await axios.post(process.env.WEBHOOK, message);
            } catch (error) {
                console.log("Someting went wrong: ", error);
                console.log(`[${this.constructor.name}] received ${JSON.stringify(message)}`);
            }
        }
    }

    public async onError(error: Error): Promise<void> {
        console.log(`[TicketStatusChangeEventConsumer]`, "error:", error);
    }

    public subscriptionOption(): Options.Consume {
        const option: Options.Consume = { noAck: true };
        return option;
    }
}
