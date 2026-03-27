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
      return {
        success: false,
        message: "Domain already exist!!!",
      };
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
