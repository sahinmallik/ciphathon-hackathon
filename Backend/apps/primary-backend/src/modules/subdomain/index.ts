import { Elysia } from "elysia";
import { SubdomainService } from "./service";
import { prisma } from "../../../../../packages/db";

export const subdomainController = new Elysia().post(
  "/subdomain-scan",
  async ({ body, set }) => {
    const { domain, clerkId } = body as { domain: string; clerkId: string };

    if (!domain) {
      set.status = 400;
      return { error: "Domain is required" };
    }

    const domaindata = await prisma.domain.findUnique({
      where: {
        domainName: domain,
      },
    });

    if (!domaindata) {
      return {
        success: false,
        message: "Domain don't exist",
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (domaindata.userId === user?.id) {
      const result = await SubdomainService.scan(domain);

      return {
        success: true,
        data: result,
      };
    } else {
      return {
        success: false,
        message: "You are not authorised",
      };
    }
  },
);
