import "dotenv/config";

import { Elysia } from "elysia";
import { verifyOwnership } from "./modules/verify-ownership";
import { app as TLSapp } from "./modules/tls";
import { emailApp } from "./modules/email-check";
import { app as Scoring } from "./modules/scoring";
import { subdomainController } from "./modules/subdomain";
import { reputationController } from "./modules/reputaion";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(verifyOwnership)
  .use(TLSapp)
  .use(emailApp)
  .use(Scoring)
  .use(subdomainController)
  .use(reputationController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
