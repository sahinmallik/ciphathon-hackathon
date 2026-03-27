import { Elysia } from "elysia";
import { EmailSecurityService } from "./service";
import { prisma } from "../../../../../packages/db";

export const emailApp = new Elysia({ prefix: "/email" }).post(
  "/check",
  async ({ body, set }) => {
    const { domain, clerkId } = body as { domain: string; clerkId: string };

    if (!domain) {
      set.status = 400;
      return { message: "Domain required" };
    }

    const result = await EmailSecurityService.fullCheck(domain);

    const domaindata = await prisma.domain.findFirst({
      where: { domainName: domain },
    });

    if (!domaindata) {
      return { message: "Domain not found" };
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (domaindata.userId !== user?.id) {
      return {
        message: "you are not authorized!!!",
      };
    }

    await prisma.domainEmailSecurity.upsert({
      where: { domainId: domaindata.id },
      update: {
        domain: result.domain,

        spfExists: result.spf.exists,
        spfRecord: result.spf.record,

        dmarcExists: result.dmarc.exists,
        dmarcRecord: result.dmarc.record,

        dkimExists: String(result.dkim.exists),
        dkimRecord: result.dkim.record,
        dkimSelector: result.dkim.selector,
        dkimNote: result.dkim.note,

        scannedAt: new Date(),
      },
      create: {
        domainId: domaindata.id,
        domain: result.domain,

        spfExists: result.spf.exists,
        spfRecord: result.spf.record,

        dmarcExists: result.dmarc.exists,
        dmarcRecord: result.dmarc.record,

        dkimExists: String(result.dkim.exists),
        dkimRecord: result.dkim.record,
        dkimSelector: result.dkim.selector,
        dkimNote: result.dkim.note,
      },
    });

    return {
      message: "Email security scan completed",
      data: result,
    };
  },
);
