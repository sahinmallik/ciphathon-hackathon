import "dotenv/config";

import { Elysia } from "elysia";
import { verifyOwnership } from "./modules/verify-ownership";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(verifyOwnership)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
