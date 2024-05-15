// Update with your config settings.
import * as DotEnv from "dotenv";

DotEnv.config();

const config = {
    client: process.env.DATABASE__DRIVER,
    connection: {
        host: process.env.DATABASE__HOST,
        database: process.env.DATABASE__DATABASE,
        user: process.env.DATABASE__USER,
        password: process.env.DATABASE__PASSWORD,
        port: Number.parseInt(process.env.DATABASE__PORT || "3306"),
    },
    pool: {
        min: parseInt(process.env.DATABASE__POOL_MIN || "1"),
        max: parseInt(process.env.DATABASE__POOL_MAX || "1"),
        acquireTimeoutMillis: parseInt(process.env.DATABASE__TIMEOUT || "180000"),
    },
    migrations: { directory: "./migrations/" },
};
module.exports = module.exports.development = module.exports.staging = module.exports.production = config;
