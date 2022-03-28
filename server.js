"use strict";

// Read the .env file.
import * as dotenv from "dotenv";
dotenv.config();

// Require the framework
import Fastify from "fastify";

// Instantiate Fastify with some config
const fastify = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
import app from "./app.js";
fastify.register(app);

export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit("request", req, res);
};
