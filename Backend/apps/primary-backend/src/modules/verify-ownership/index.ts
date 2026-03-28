import Elysia from "elysia";
import { VerifyOwnershipAction } from "./service";
import { VerifyOwnershipModel } from "./model";
import { prisma } from "../../../../../packages/db";

export const verifyOwnership = new Elysia()
  .post(
    "/owner",
    async ({ body, set }) => {
      const result = await prisma.domain.findUnique({
        where: {
          domainName: body.domain,
        },
      });

      const user = await prisma.user.findUnique({
        where: {
          clerkId: body.clerkId,
        },
      });

      if (!result) {
        const secretKey = await VerifyOwnershipAction.generateSecretKey(
          body.clerkId,
          body.domain,
        );

        if (!secretKey) {
          set.status = 400;
          return { message: "Failed to Generate Secret Key" };
        }

        return { success: true, secretKey };
      }
      if (result.userId === user?.id) {
        return {
          success: false,
          redirect: true, // Add a boolean flag for easier frontend checking
          message: "Domain already exist!!!",
          id: result.id,
        };
      }

      // 3. If domain exists but belongs to someone else
      set.status = 403;
      return { success: false, message: "Domain registered by another user." };
    },
    {
      body: VerifyOwnershipModel.verifyOwnershipRequest,
    },
  )
  .post(
    "/verify",
    async ({ body, set }) => {
      try {
        const record = await prisma.domain.findUnique({
          where: {
            secretKey: body.secretKey,
          },
        });

        if (!record) {
          set.status = 404;
          return { message: "Verification record not found" };
        }

        if (record.isVerified) {
          return { message: "Already verified" };
        }
        const result = await VerifyOwnershipAction.scanTXT(
          body.domain,
          body.secretKey,
        );
        if (result.success) {
          return {
            message: "Domain verified successfully",
          };
        }
      } catch (error) {
        set.status = 500;
        return {
          message: "DNS lookup failed",
          error: (error as Error).message,
        };
      }
    },
    {
      body: VerifyOwnershipModel.scanTXTRequest,
    },
  );
