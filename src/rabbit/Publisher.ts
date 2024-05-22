import { IActionUpdateStatus } from "@app/modules/tickets/dto/TicketResponse";
import { Channel, connect, Connection } from "amqplib";

class Publisher {
    private _connect: Connection;
    private _channel: Channel;

    protected exchange = "exchange-test";
    public async create() {
        this._connect = await connect(`amqp://${process.env.RABBITMQ_HOST}}`);
        this._channel = await this._connect.createChannel();
        this._channel.assertExchange(this.exchange, "topic");
    }
    public async publish(msg: IActionUpdateStatus) {
        if (!this._channel) {
            await this.create();
        }
        this._channel.publish(this.exchange, "hello.anything", Buffer.from(JSON.stringify(msg)));
        console.log(" [x] Sent %s", msg.toString());
    }
}

export default Publisher;
