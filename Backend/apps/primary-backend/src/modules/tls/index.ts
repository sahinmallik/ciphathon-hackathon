import { Elysia } from "elysia";
import { TlsModel } from "./model";
import { TlsService } from "./service";
import { prisma } from "../../../../../packages/db";

export const app = new Elysia({ prefix: "/health" }).post(
  "/",
  async ({ body, set }) => {
    try {
      const result = await TlsService.getSSLStatus(body.domain);

      if (!result.connection || !result.data) {
        set.status = 400;
        return {
          message: "Connection Failed!!!",
        };
      }
      if (!result) {
        set.status = 400;
        return {
          message: "Connection Failed!!!",
        };
      }
      const domain = await prisma.domain.findUnique({
        where: {
          domainName: body.domain,
        },
      });
      const user = await prisma.user.findUnique({
        where: {
          clerkId: body.clerkId,
        },
      });
      if (!domain) {
        return {
          message: "Domain is not verified",
        };
      }
      if (domain && domain.userId === user?.id) {
        await prisma.domainSSL.upsert({
          where: {
            domainId: domain.id,
          },
          update: {
            valid: result.data.valid,
            daysRemaining: result.data.daysRemaining,
            issuer: result.data.issuer,
            protocol: result.data.protocol,
            lastCheckedAt: new Date(),
          },
          create: {
            domainId: domain.id,
            valid: result.data.valid,
            daysRemaining: result.data.daysRemaining,
            issuer: result.data.issuer,
            protocol: result.data.protocol,
          },
        });

        return result.data;
      } else {
        return {
          message: "You are not authorized!!!",
        };
      }
    } catch (error) {
      set.status = 500;
      return { message: "Connection Failed!!!" };
    }
  },
  {
    body: TlsModel.tlsRequestSchema,
  },
);
