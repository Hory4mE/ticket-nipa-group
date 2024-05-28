import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

export const connectRedis = async (): Promise<void> => {
    if (client) return;
    client = createClient({
        url: `redis://localhost:6379`,
    });

    client.on("error", (err) => console.error("Redis Client Error", err));
    await client.connect();
};

export const getRedisClient = (): RedisClientType => {
    if (!client) throw new Error("Redis client is not connected");
    return client;
};

export const disconnectRedis = async (): Promise<void> => {
    if (!client) return;
    await client.disconnect();
    client = null;
};
