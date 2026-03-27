import Elysia from "elysia";
import { TlsService } from "../tls/service";
import { EmailSecurityService } from "../email-check/service";
import { ScoringService } from "./service";
import { prisma } from "../../../../../packages/db";

export const app = new Elysia().post("/analyze", async ({ body }) => {
  const { domain, clerkId } = body as { domain: string; clerkId: string };

  const domaindata = await prisma.domain.findUnique({
    where: {
      domainName: domain,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      clerkId,
    },
  });

  if (!domain) {
    return {
      success: false,
      message: "The domain is not registered!!!",
    };
  }
  if (domaindata?.userId === user?.id) {
    const [tls, email] = await Promise.all([
      TlsService.getSSLStatus(domain),
      EmailSecurityService.fullCheck(domain),
    ]);

    const score = ScoringService.calculate({
      tls,
      email,
    });

    return {
      tls,
      email,
      score,
    };
  } else {
    return {
      success: false,
      message: "You are not authorized!!!",
    };
  }
});
