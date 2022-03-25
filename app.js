import { envSetting, mongodbConnector, postgresConnector, corsSetting, cookieSetting, jwtSetting, swaggerSetting } from "./appSettings.js";
import routes from "./src/routes/routes.js";

const app = async (fastify, options) => {
    fastify.register(envSetting);
    fastify.register(mongodbConnector);
    fastify.register(postgresConnector);
    fastify.register(corsSetting);
    fastify.register(cookieSetting);
    fastify.register(jwtSetting);
    fastify.register(swaggerSetting);
    fastify.register(routes);
};

export default app;
