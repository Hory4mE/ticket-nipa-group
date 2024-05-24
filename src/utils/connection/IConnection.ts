import { Connection } from "amqplib";

export interface IConnector {
    establishConnection: () => Promise<Connection>;
    connect: () => Promise<void>;
}
