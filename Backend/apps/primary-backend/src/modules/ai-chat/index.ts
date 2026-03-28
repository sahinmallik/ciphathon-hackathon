import { Elysia, t } from "elysia";
import { AiChatService } from "./service";
import { prisma } from "../../../../../packages/db";

export const aiChatApp = new Elysia({ prefix: "/ai" }).post(
  "/chat",
  async ({ body, set }) => {
    const { message, context, domain, clerkId } = body;

    // 1. AUTH CHECK: Is there a user?
    if (!clerkId) {
      set.status = 401;
      return { message: "Unauthorized: No identity provided." };
    }

    // 2. OWNERSHIP CHECK: Does this user own this domain in your DB?
    const dbDomain = await prisma.domain.findFirst({
      where: {
        domainName: domain,
        user: { clerkId: clerkId }, // Ensures link between Clerk and DB
      },
    });

    if (!dbDomain) {
      set.status = 403;
      return { message: "Forbidden: You do not own this asset." };
    }

    // 3. OPTIONAL: Check for "Scanning" status
    // You can ensure they've actually run a scan before chatting
    if (!context || Object.keys(context).length === 0) {
      set.status = 400;
      return { message: "No security context provided for analysis." };
    }

    const reply = await AiChatService.generateResponse(
      message,
      context,
      domain,
    );

    return { success: true, reply };
  },
  {
    body: t.Object({
      message: t.String(),
      domain: t.String(),
      clerkId: t.String(), // Pass this from the frontend useUser() hook
      context: t.Any(),
    }),
  },
);
