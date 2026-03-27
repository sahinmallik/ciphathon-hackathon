import { Elysia } from "elysia";
import { ReputationService } from "./service";

export const reputationController = new Elysia().post(
  "/reputation-scan",
  async ({ body, set }) => {
    const { domain, emailData, tlsData } = body as {
      domain: string;
      emailData?: any;
      tlsData?: any;
    };

    if (!domain) {
      set.status = 400;
      return { error: "Domain is required" };
    }

    const result = await ReputationService.scan(domain, emailData, tlsData);

    return {
      success: true,
      data: result,
    };
  },
);
