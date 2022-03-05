// ESM
import fastifyPlugin from "fastify-plugin";
import fastifyMongo from "fastify-mongodb";
import fastifyENV from "fastify-env";
import swagger from "fastify-swagger";

const dbConnector = fastifyPlugin(async (fastify, options) => {
    fastify.register(fastifyMongo, {
        url: fastify.config.MONGO_URL,
    });
});

const envSetting = fastifyPlugin(async (fastify, options) => {
    fastify
        .register(fastifyENV, {
            dotenv: true,
            schema: {
                type: "object",
                properties: {
                    PORT: { type: "integer", default: 3001 },
                    NODE_ENV: { type: "string" },
                    MONGO_URL: { type: "string" },
                },
            },
        })
        .ready((err) => {
            if (err) console.error(err);
            // console.log(fastify.config);
        });
});

const swaggerSetting = fastifyPlugin(async (fastify, options) => {
    fastify.register(swagger, {
        routePrefix: "/docs",
        exposeRoute: true,
        swagger: {
            info: {
                title: "User Project Managing API",
                description: "APIs for managing user projects",
                version: "0.1.0",
            },
            // host: "localhost:" + fastify.config.PORT,
            // schemes: ["http"],
            // consumes: ["application/json"],
            // produces: ["application/json"],
            tags: [
                { name: "project", description: "Project management related end-points" },
                { name: "save", description: "Project saving related end-points" },
                { name: "load", description: "Project loading related end-points" },
            ],
            definitions: {
                project: {
                    type: "object",
                    required: ["user_idx", "proj_idx", "layout"],
                    properties: {
                        user_idx: { type: "string" },
                        proj_idx: { type: "string" },
                        layout: { type: "object" },
                    },
                },
                projects: {
                    type: "array",
                    items: {
                        $ref: "#/definitions/project",
                    },
                },
            },
            // securityDefinitions: {
            //     apiKey: {
            //         type: "jwt",
            //         name: "jwt",
            //         in: "header",
            //     },
            // },
        },
    });
});

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
export { dbConnector, envSetting, swaggerSetting };
