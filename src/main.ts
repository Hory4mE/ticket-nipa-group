import "reflect-metadata";

import * as DotEnv from "dotenv";

import { Application } from "./Application";
import { authorizationChecker } from "./middlewares/AuthenticationMiddleware";

DotEnv.config();

const port = parseInt(process.env.PORT || "5500");
const app = new Application();
app.start(port);
app.useServer({
    cors: true,
    authorizationChecker,
});
