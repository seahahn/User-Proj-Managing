// ESM
import fastifyPlugin from "fastify-plugin";
import fastifyMongo from "fastify-mongodb";
import fastifyPostgres from "fastify-postgres";
import fastifyENV from "fastify-env";
import fastifyCORS from "fastify-cors";
import swagger from "fastify-swagger";

const mongodbConnector = fastifyPlugin(async (fastify, options) => {
  fastify.register(fastifyMongo, {
    url: fastify.config.MONGO_URL,
  });
});

const postgresConnector = fastifyPlugin(async (fastify, options) => {
  fastify.register(fastifyPostgres, {
    connectionString: fastify.config.POSTGRES_URL,
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
          POSTGRES_URL: { type: "string" },
          AWS_ACCESS_KEY_ID: { type: "string" },
          AWS_SECRET_ACCESS_KEY: { type: "string" },
        },
      },
    })
    .ready((err) => {
      if (err) console.error(err);
    });
});

const corsSetting = fastifyPlugin(async (fastify, options) => {
  fastify.register(fastifyCORS, {
    // origin: ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "User-Id"],
    credentials: true,
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
      host: "localhost:" + fastify.config.PORT,
      schemes: ["http", "https", "ws", "wss"],
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

export { mongodbConnector, postgresConnector, envSetting, swaggerSetting, corsSetting };
