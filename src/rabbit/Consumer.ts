import amqp, { ConsumeMessage } from "amqplib/callback_api";
import axios from "axios";

const Consumer = () => {
    const con = amqp.connect(
        `amqp://${process.env.RABBITMQ_HOST}`,
        function (error0: any, connection: { createChannel: (arg0: (error1: any, channel: any) => void) => void }) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }
                var exchange = "exchange-test";
                channel.assertQueue(
                    "",
                    {
                        exclusive: true,
                    },
                    function (error2: any, q: { queue: any }) {
                        if (error2) {
                            throw error2;
                        }
                        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
                        channel.bindQueue(q.queue, exchange, "hello.*");

                        channel.consume(
                            q.queue,
                            async function (msg: ConsumeMessage) {
                                if (msg.content) {
                                    await axios.post(
                                        process.env.WEBHOOK,
                                        msg.content
                                    );
                                    console.log(" [x] %s", msg.content.toString());
                                } else {
                                    console.log("WTF");
                                }
                            },
                            {
                                noAck: true,
                            }
                        );
                    }
                );
            });
        }
    );
    return con;
};

export default Consumer;
