import { ConfirmChannel, Options } from "amqplib";
import { RabbitMQConnector, RabbitMQConnectionState } from "../connection/RabbitMQConnector";

export interface IMessageExchangeProducer<TMessage> {
    exchange: string;
    routingKey: string;
    send(payload: TMessage): Promise<any>;
}

export abstract class RabbitMQProducer<TMessage> implements IMessageExchangeProducer<TMessage> {
    public abstract exchange: string;
    public abstract routingKey: string;
    private _initialized = false;
    private _channel: ConfirmChannel;

    public get isInitialized() {
        return this._initialized;
    }

    constructor(
        private readonly rabbitConnector: RabbitMQConnector,
        private options?: {
            assertQueue?: Options.AssertQueue;
        }
    ) {
        this.rabbitConnector.on("error", this.onError);

        this.rabbitConnector.on("error", this._resetState);
        this.rabbitConnector.on("connectionStateChanged", this._reinitializeWhenStateIsConnected);
    }

    public abstract messageSerializer(raw: TMessage): Buffer;
    public abstract messageDeserializer(raw: Buffer): TMessage;

    public abstract onError(error: Error): Promise<void>;

    public async init() {
        if (this.isInitialized) {
            return;
        }

        try {
            console.log(`[RabbitMQProducer][${this.constructor.name}] Initializing`);

            this._channel = await this.rabbitConnector.createChannel();
            await this._channel.assertExchange(this.exchange, "topic", { durable: true });

            this._initialized = true;
            console.log(`[RabbitMQProducer][${this.constructor.name}] Initialized`);
        } catch (e) {
            console.error(`[RabbitMQProducer][${this.constructor.name}] Initializing error -`, e);
        }
    }

    public async send(payload: TMessage, options?: Options.Publish) {
        if (!this._initialized) {
            await this.init();
        }
        const payloadSerialized = this.messageSerializer(payload);
        this._channel.publish(this.exchange, this.routingKey, payloadSerialized, options);
        console.log(
            `[RabbitMQProducer][${this.constructor.name}]-[priority: ${options?.priority ?? 0}] `,
            `Sent to exchange "${this.exchange}"`,
            `with routing key "${this.routingKey}" key: ${payloadSerialized}`
        );
    }

    public async waitForConfirms() {
        if (this._channel) {
            return this._channel.waitForConfirms();
        }
    }

    private _resetState = async () => {
        this._channel = undefined;
        this._initialized = false;
    };

    private _reinitializeWhenStateIsConnected = async (connectionState: RabbitMQConnectionState) => {
        if (connectionState === RabbitMQConnectionState.Connected) {
            await this.init();
        }
    };
}

// import { ConfirmChannel, Options } from "amqplib";
// import { RabbitMQConnector } from "../connection/RabbitMQConnector";

// // export interface IMessageExchangeProducer<TMessage> {
// //     exchange: string;
// //     routingKey: string;
// //     send(payload: TMessage): Promise<any>;
// // }

// export class RabbitMQProducer<TMessage> {
//     public exchange: string;
//     public routingKey: string;
//     private _initialized = false;
//     private _channel: ConfirmChannel;

//     public get isInitialized() {
//         return this._initialized;
//     }

//     constructor(
//         private readonly rabbitConnector: RabbitMQConnector,
//         private options?: {
//             assertQueue?: Options.AssertQueue;
//         }
//     ) {
//         // this.rabbitConnector.on("error", this.onError);
//         // this.rabbitConnector.on("error", this._resetState);
//         // this.rabbitConnector.on("connectionStateChanged", this._reinitializeWhenStateIsConnected);
//     }

//     public messageSerializer(raw: TMessage): Buffer {
//         return Buffer.from(JSON.stringify(raw));
//     }

//     // public messageDeserializer(raw: Buffer): TMessage;

//     // public onError(error: Error): Promise<void>;

//     public async init() {
//         if (this.isInitialized) {
//             return;
//         }

//         try {
//             console.log(`[RabbitMQProducer][${this.constructor.name}] Initializing`);

//             this._channel = await this.rabbitConnector.createChannel();
//             await this._channel.assertExchange(this.exchange, "direct", { durable: true });

//             this._initialized = true;
//             console.log(`[RabbitMQProducer][${this.constructor.name}] Initialized`);
//         } catch (e) {
//             console.error(`[RabbitMQProducer][${this.constructor.name}] Initializing error -`, e);
//         }
//     }

//     public async send(payload: TMessage, options?: Options.Publish) {
//         if (!this._initialized) {
//             await this.init();
//         }
//         const payloadSerialized = this.messageSerializer(payload);
//         console.log(payloadSerialized)
//         this._channel.publish(this.exchange, this.routingKey, payloadSerialized, options);
//         console.log(
//             `[RabbitMQProducer][${this.constructor.name}]-[priority: ${options?.priority ?? 0}] `,
//             `Sent to exchange "${this.exchange}"`,
//             `with routing key "${this.routingKey}" key: ${payloadSerialized}`
//         );
//     }

//     // public async waitForConfirms() {
//     //     if (this._channel) {
//     //         return this._channel.waitForConfirms();
//     //     }
//     // }

//     public close = async () => {
//         this._channel = undefined;
//         this._initialized = false;
//         console.log(`[RabbitMQProducer][${this.constructor.name}] Connection closed`);
//     };

//     // private _reinitializeWhenStateIsConnected = async (connectionState: RabbitMQConnectionState) => {
//     //     if (connectionState === RabbitMQConnectionState.Connected) {
//     //         await this.init();
//     //     }
//     // };
// }
