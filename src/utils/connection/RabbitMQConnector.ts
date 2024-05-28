/* eslint-disable @typescript-eslint/no-explicit-any */
import { Token } from "@nipacloud/framework/core/ioc";
import { ConfirmChannel, Connection, Options, connect } from "amqplib";

import { ApplicationError } from "@nipacloud/framework/core/error";
import { Emitter } from "@nipacloud/framework/core/util/Emitter";
import { IConnector } from "./IConnection";

export enum RabbitMQExchangeType {
    Direct = "direct",
    Topic = "topic",
    Headers = "headers",
    Fanout = "fanout",
    Match = "match",
}

export enum RabbitMQConnectionState {
    Closed = "Closed",
    Connecting = "Connecting",
    Connected = "Connected",
}

export type RabbitMQConfiguration = {
    retry?: number;
    retryCoolDown?: number;
    connectTimeout?: number;
    autoReconnect?: boolean;
} & Options.Connect;

export class RabbitMQError extends ApplicationError {
    constructor(message: string, public innerError?: Error) {
        super(message);
    }
}

export class RabbitMQConnector extends Emitter implements IConnector {
    private _connection: Connection;
    private _connectionState: RabbitMQConnectionState = RabbitMQConnectionState.Closed;
    private _channel: ConfirmChannel;
    private _retryCount = 0;

    constructor(options: RabbitMQConfiguration) {
        super();
        this._options = {
            ...this._options,
            ...options,
        };
    }

    get options() {
        return this._options;
    }

    get connectionState() {
        return this._connectionState;
    }

    private set connectionState(value: RabbitMQConnectionState) {
        this._connectionState = value;
        console.log(`[RabbitMQConnector] Connection state changed to "${value}"`);
        this.emit("connectionStateChanged", this._connectionState, this.connection);
    }

    get connection() {
        return this._connection;
    }

    get channel() {
        return this._channel;
    }

    public on(
        type: "connectionStateChanged",
        handler: (connectionState: RabbitMQConnectionState, connection: Connection) => void | Promise<void>
    ): void | Promise<void>;
    public on(type: "error", handler: (e: Error) => any | Promise<any>): void | Promise<void>;
    public on(type: "retryExceeded", handler: (e: Error) => any | Promise<any>): void | Promise<void>;
    public on(type: string, handler: (...params: any) => any): void | Promise<void> {
        super.on(type, handler);
    }
    private _options: RabbitMQConfiguration = {
        protocol: "amqp",
        retry: 10,
        retryCoolDown: 10000,
        connectTimeout: 30000,
        autoReconnect: true,
    };

    private get url() {
        return `${this._options.protocol}://${this._options.hostname}:${this._options.port}`;
    }
    public async connect() {
        if (this.connectionState === RabbitMQConnectionState.Connected) {
            return;
        }

        if (this.connectionState === RabbitMQConnectionState.Closed) {
            console.log("[RabbitMQConnector] Start establishing connection");
            await this.establishConnection();
        }
    }

    public async establishConnection() {
        try {
            if (this._connectionState in [RabbitMQConnectionState.Connecting, RabbitMQConnectionState.Connected]) {
                return;
            }
            this.connectionState = RabbitMQConnectionState.Connecting;
            this._connection = await connect(this._options, { timeout: this._options.connectTimeout });
            this._connection.on("error", (e) => this.handleError(e));
            this.connectionState = RabbitMQConnectionState.Connected;
            this._retryCount = 0;
            console.log(`[RabbitMQConnector] Connection established at`, this.url);

            return this._connection;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async createChannel() {
        if (this.connectionState === RabbitMQConnectionState.Connected) {
            this._channel = await this.connection.createConfirmChannel();
            this._channel.on("close", () => {
                console.log(`[RabbitMQConnector] Channel closed`);
                this.handleError(new RabbitMQError("Channel closed"));
            });
            return this._channel;
        } else {
            throw new RabbitMQError("Cannot create a channel when the connection is not established");
        }
    }

    private async handleError(e: Error) {
        console.error(`[RabbitMQConnector] An error occured -`, e);

        this._connection = undefined;
        this.connectionState = RabbitMQConnectionState.Closed;

        this.emit("error", e);

        if (this._options.autoReconnect) {
            try {
                await this.retryConnection();
            } catch (catchError) {
                console.error(`[RabbitMQConnector] Retry exceeded`);
                this.emit("retryExceeded", catchError);
            }
        }
    }

    private async retryConnection() {
        if (this._retryCount < this._options.retry) {
            // prettier-ignore
            // eslint-disable-next-line max-len
            console.log(`[RabbitMQConnector] Retry ${this._retryCount++} times establishing connection to`, this.url, `in ${this._options.retryCoolDown}ms`);
            try {
                await new Promise((resolve, reject) =>
                    setTimeout(() => {
                        this.establishConnection().then(resolve).catch(reject);
                    }, this._options.retryCoolDown)
                );
            } catch (e) {
                if (this._retryCount === this._options.retry) {
                    throw e;
                } else {
                    await this.handleError(e);
                }
            }
        } else {
            this.emit("retryExceeded", new RabbitMQError("Retry exceeded"));
        }
    }
}

export const RabbitMQConnectorIdentifier = new Token<RabbitMQConnector>();

// import { ApplicationError } from "@nipacloud/framework/core/error/ApplicationError";
// import { Token } from "@nipacloud/framework/core/ioc";
// import { Emitter } from "@nipacloud/framework/core/util/Emitter";
// import { ConfirmChannel, Connection, Options, connect } from "amqplib";
// import { IConnector } from "./IConnection";

// export enum RabbitMQConnectionState {
//     Closed = "Closed",
//     Connecting = "Connecting",
//     Connected = "Connected",
// }

// export type RabbitMQConfiguration = {
//     retry?: number;
//     retryCoolDown?: number;
//     connectTimeout?: number;
//     autoReconnect?: boolean;
// } & Options.Connect;

// export class RabbitMQError extends ApplicationError {
//     constructor(message: string, public innerError?: Error) {
//         super(message);
//     }
// }

// export class RabbitMQConnector extends Emitter implements IConnector {
//     private _connection: Connection;
//     private _connectionState: RabbitMQConnectionState = RabbitMQConnectionState.Closed;
//     private _channel!: ConfirmChannel;

//     constructor() {
//         super();
//         // this._options = {
//         //     ...this._options,
//         //     ...options,
//         // };
//     }

//     get connectionState() {
//         return this._connectionState;
//     }

//     private set connectionState(value: RabbitMQConnectionState) {
//         this._connectionState = value;
//         console.log(`[RabbitMQConnector] Connection state changed to "${value}"`);
//         this.emit("connectionStateChanged", this._connectionState, this.connection);
//     }

//     get connection() {
//         return this._connection;
//     }

//     get channel() {
//         return this._channel;
//     }

//     public on(
//         type: "connectionStateChanged",
//         handler: (connectionState: RabbitMQConnectionState, connection: Connection) => void | Promise<void>
//     ): void | Promise<void>;
//     public on(type: "error", handler: (e: Error) => any | Promise<any>): void | Promise<void>;
//     public on(type: "retryExceeded", handler: (e: Error) => any | Promise<any>): void | Promise<void>;
//     public on(type: string, handler: (...params: any) => any): void | Promise<void> {
//         super.on(type, handler);
//     }
//     private _options: RabbitMQConfiguration = {
//         protocol: "amqp",
//         retry: 10,
//         retryCoolDown: 10000,
//         connectTimeout: 30000,
//         autoReconnect: true,
//     };

//     private get url() {
//         return `amqp://localhost`;
//     }

//     public async connect() {
//         if (this.connectionState === RabbitMQConnectionState.Connected) {
//             return;
//         }

//         if (this.connectionState === RabbitMQConnectionState.Closed) {
//             console.log("[RabbitMQConnector] Start establishing connection");
//             await this.establishConnection();
//         }
//     }

//     public async establishConnection() {
//         try {
//             if (this._connectionState in [RabbitMQConnectionState.Connecting, RabbitMQConnectionState.Connected]) {
//                 return;
//             }
//             this.connectionState = RabbitMQConnectionState.Connecting;
//             this._connection = await connect(this.url, { timeout: this._options.connectTimeout });
//             this.connectionState = RabbitMQConnectionState.Connected;
//             console.log(`[RabbitMQConnector] Connection established at`, this.url);

//             return this._connection;
//         } catch (error) {
//             this.handleError(error);
//         }
//     }

//     public async createChannel() {
//         if (this.connectionState === RabbitMQConnectionState.Connected) {
//             this._channel = await this.connection.createConfirmChannel();
//             this._channel.on("close", () => {
//                 console.log(`[RabbitMQConnector] Channel closed`);
//                 this.handleError(new RabbitMQError("Channel closed"));
//             });
//             return this._channel;
//         } else {
//             throw new RabbitMQError("Cannot create a channel when the connection is not established");
//         }
//     }

//     private async handleError(e: Error) {
//         console.error(`[RabbitMQConnector] An error occured -`, e);

//         this._connection = undefined;
//         this.connectionState = RabbitMQConnectionState.Closed;

//         this.emit("error", e);
//     }
// }

// // export const RabbitMQConnectorIdentifier = new Token<RabbitMQConnector>();
