import { envSetting, dbConnector, swaggerSetting } from "./appSettings.js";
import routes from "./routes/routes.js";

const app = async (fastify, options) => {
    fastify.register(envSetting);
    // console.log("envSetting");
    fastify.register(dbConnector);
    // console.log("dbConnector");
    fastify.register(swaggerSetting);
    // console.log("swagger");
    fastify.register(routes);
    // console.log("routes");
};

export default app;
