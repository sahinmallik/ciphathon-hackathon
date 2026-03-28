import { Elysia, t } from "elysia";
import { PortService } from "./service";

export const portScanModule = new Elysia({ prefix: "/port-scan" }).post(
  "/",
  async ({ body }) => {
    const { domain } = body;
    const openPorts = await PortService.scanCommonPorts(domain);

    return {
      success: true,
      domain,
      openPorts,
      count: openPorts.length,
    };
  },
  {
    body: t.Object({
      domain: t.String(),
    }),
  },
);
