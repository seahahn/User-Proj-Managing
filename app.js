import { envSetting, dbConnector, corsSetting, swaggerSetting } from "./appSettings.js";
import fastifySensible from "fastify-sensible";
import routes from "./routes/routes.js";

const app = async (fastify, options) => {
    fastify.register(envSetting);
    fastify.register(dbConnector);
    fastify.register(corsSetting);
    fastify.register(fastifySensible);
    fastify.register(swaggerSetting);
    fastify.register(routes);
};

export default app;
