import { RabbitMQConnector } from "@app/utils/connection/RabbitMQConnector";
import { RabbitMQProducer } from "@app/utils/message/RabbitMQProducer";
import { Service, Token } from "@nipacloud/framework/core/ioc";
import { IActionUpdateStatus } from "../tickets/dto/TicketResponse";

@Service()
export class TicketStatusChangeProducer extends RabbitMQProducer<IActionUpdateStatus> {
    public exchange: string = "heldesk-ticket";
    public routingKey: string = "update-ticket-status";
    constructor(rabbitConnector: RabbitMQConnector, option: { prefixTopic: string }) {
        super(rabbitConnector, { assertQueue: { maxPriority: 2 } });
        this.exchange = `${option.prefixTopic ?? ""}${this.exchange}`;
    }

    public messageDeserializer(raw: Buffer): IActionUpdateStatus {
        return JSON.parse(raw.toString()) as IActionUpdateStatus;
    }

    public messageSerializer(raw: IActionUpdateStatus): Buffer {
        return Buffer.from(JSON.stringify(raw));
    }

    public async onError(): Promise<void> {}
}

export const WalletTypeChangedEventIdentifier = new Token<TicketStatusChangeProducer>("WalletTypeChangedEventProducer");
