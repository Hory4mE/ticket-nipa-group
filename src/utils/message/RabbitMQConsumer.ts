/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from "@nipacloud/framework/core/ioc";
import { Logger } from "@nipacloud/framework/core/util/log";
import { Channel, ConsumeMessage, Options } from "amqplib";
import { randomUUID } from "crypto";
import { RabbitMQConnectionState, RabbitMQConnector } from "../connection/RabbitMQConnector";

export interface IRabbitMQCommiter {
    rawMessage: ConsumeMessage;
    commit: () => void;
    defer: () => void;
}

export interface IMessageExchangeConsumer<TMessage> {
    queue: string;
    exchange: string;
    routingKeys: string[];
    onMessage(message: TMessage, ...params: any[]): Promise<void>;
    onError(error: any): Promise<void>;
    init(...params: any[]): Promise<void>;
    unsubscribe(): Promise<void>;
}

export abstract class RabbitMQConsumer<TMessage> implements IMessageExchangeConsumer<TMessage> {
    get consumerTag() {
        return `${this.constructor.name}/${this.consumerId}`;
    }

    get isInitialized() {
        return this._initialized;
    }

    public consumerId = randomUUID();

    public abstract routingKeys: string[];
    public abstract queue: string;
    public abstract exchange: string;
    public abstract messageDeserializer: (raw: Buffer) => TMessage;
    public _logger = Container.get(Logger);
    private _initialized: boolean = false;
    private _channel: Channel;

    constructor(
        private readonly rabbitConnector: RabbitMQConnector,
        private options?: {
            assertQueue: Options.AssertQueue;
            prefetch?: number;
        }
    ) {
        this.rabbitConnector.on("error", this.onError);

        this.rabbitConnector.on("error", this._unsubscribeAndResetState);
        this.rabbitConnector.on("connectionStateChanged", this._reinitializeWhenStateIsConnected);
    }
    public abstract onUnsubscribed(): void;
    public abstract onMessage(message: TMessage, committer?: IRabbitMQCommiter): Promise<void>;
    public abstract onError(error: Error): Promise<void>;
    public abstract subscriptionOption(): Options.Consume;

    public async unsubscribe(): Promise<void> {
        if (this._channel) {
            await this._channel.cancel(this.queue);
        }
    }

    public async init() {
        if (this.isInitialized) {
            return;
        }

        try {
            this._logger.info(`[RabbitMQConsumer][${this.constructor.name}] Initializing`);

            const subscriptionOption = this.subscriptionOption();
            if (!subscriptionOption.consumerTag) {
                subscriptionOption.consumerTag = this.consumerTag;
            }
            this._channel = await this.rabbitConnector.createChannel();

            if (this.options?.prefetch) {
                await this._channel.prefetch(this.options.prefetch);
            }

            await this._channel.assertExchange(this.exchange, "topic", { durable: true });
            await this._channel.assertQueue(this.queue, this.options?.assertQueue);
            for (const routingKey of this.routingKeys) {
                await this._channel.bindQueue(this.queue, this.exchange, routingKey);
            }
            await this._channel.consume(this.queue, this._messageListener, subscriptionOption);
            this._logger.info(`[RabbitMQConsumer][${this.constructor.name}] Subscribed to queue "${this.queue}"`);

            this._initialized = true;
            this._logger.info(`[${this.constructor.name}] Initialized`);
        } catch (e) {
            this._logger.error(`[${this.constructor.name}] Initializing error -`, e);
        }
    }
    private _unsubscribeAndResetState = async () => {
        this._logger.info(`[RabbitMQConsumer][${this.constructor.name}] Unsubscribing`);
        try {
            await this.unsubscribe();
        } finally {
            this._channel = undefined;
            this._initialized = false;
        }
    };

    private _reinitializeWhenStateIsConnected = async (connectionState: RabbitMQConnectionState) => {
        if (connectionState === RabbitMQConnectionState.Connected) {
            await this.init();
        }
    };

    private _messageListener = (message: ConsumeMessage) => {
        const deserialized = this.messageDeserializer(message.content);
        this.onMessage(deserialized, {
            rawMessage: message,
            commit: () => {
                return this._channel.ack(message);
            },
            defer: () => {
                this._channel.ack(message);
                this._channel.sendToQueue(this.queue, message.content, { priority: message.properties.priority });
            },
        });
    };
}

// import { Container } from "@nipacloud/framework/core/ioc";
// import { Logger } from "@nipacloud/framework/core/util/log";
// import { Channel, ConsumeMessage, Options } from "amqplib";
// import axios from "axios";
// import { RabbitMQConnector } from "../connection/RabbitMQConnector";

// export class RabbitMQConsumer {
//     get isInitialized() {
//         return this._initialized;
//     }

//     public routingKeys: string[];
//     public queue: string;
//     public exchange: string;
//     public _logger = Container.get(Logger);
//     private _initialized: boolean = false;
//     private _channel: Channel;

//     constructor(
//         private readonly rabbitConnector: RabbitMQConnector,
//         private options?: {
//             assertQueue: Options.AssertQueue;
//             prefetch?: number;
//         }
//     ) {
//         // this.rabbitConnector.on("error", this.onError);
//         // this.rabbitConnector.on("error", this._unsubscribeAndResetState);
//         // this.rabbitConnector.on("connectionStateChanged", this._reinitializeWhenStateIsConnected);
//     }

//     public async init() {
//         if (this.isInitialized) {
//             return;
//         }

//         try {
//             this._logger.info(`[RabbitMQConsumer][${this.constructor.name}] Initializing`);
//             this._channel = await this.rabbitConnector.createChannel();

//             // if (this.options?.prefetch) {
//             //     await this._channel.prefetch(this.options.prefetch);
//             // }

//             await this._channel.assertExchange(this.exchange, "direct", { durable: true });
//             await this._channel.assertQueue(this.queue, this.options?.assertQueue);
//             for (const routingKey of this.routingKeys) {
//                 await this._channel.bindQueue(this.queue, this.exchange, routingKey);
//             }
//             await this._channel.consume(this.queue, this._messageListener, { noAck: true });
//             this._logger.info(`[RabbitMQConsumer][${this.constructor.name}] Subscribed to queue "${this.queue}"`);

//             this._initialized = true;
//             this._logger.info(`[${this.constructor.name}] Initialized`);
//         } catch (e) {
//             this._logger.error(`[${this.constructor.name}] Initializing error -`, e);
//         }
//     }

//     private _messageListener = async (message: ConsumeMessage) => {
//         if (message) {
//             const body = message.content;
//             await axios.post("https://webhook.site/6d39a67e-deec-431c-b8fc-d1e9aecf0f89", body);
//         }
//     };
// }
