import "dotenv/config";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors"; // 1. Import CORS
import { verifyOwnership } from "./modules/verify-ownership";
import { app as TLSapp } from "./modules/tls";
import { emailApp } from "./modules/email-check";
import { app as Scoring } from "./modules/scoring";
import { subdomainController } from "./modules/subdomain";
import { reputationController } from "./modules/reputaion";
import { app as AddUser } from "./modules/add-user";

const app = new Elysia()
  .use(
    cors({
      origin: "http://localhost:3000", // Allow only your Next.js app
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .get("/", () => "Hello Elysia")
  .use(verifyOwnership)
  .use(TLSapp)
  .use(emailApp)
  .use(Scoring)
  .use(subdomainController)
  .use(reputationController)
  .use(AddUser)
  .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
