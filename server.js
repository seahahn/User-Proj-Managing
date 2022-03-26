"use strict";

// Read the .env file.
import * as dotenv from "dotenv";
dotenv.config();

// Require the framework
import Fastify from "fastify";

// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
import app from "./app";
app.register(app);

// export default async (req, res) => {
//   await app.ready();
//   app.server.emit("request", req, res);
// };
app.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
