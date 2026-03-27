import Elysia from "elysia";
import { VerifyOwnershipAction } from "./service";
import { VerifyOwnershipModel } from "./model";

export const verifyOwnership = new Elysia()
  .post(
    "/owner",
    async ({ body, set }) => {
      const secretKey = await VerifyOwnershipAction.generateSecretKey(
        body.clerkId,
        body.domain,
      );

      if (!secretKey) {
        set.status = 400;
        return { message: "Failed to Generate Secret Key" };
      }

      return { secretKey };
    },
    {
      body: VerifyOwnershipModel.verifyOwnershipRequest,
      response: {
        200: VerifyOwnershipModel.verifyOwnershipResponse,
        400: VerifyOwnershipModel.verifyOwnershipFailedResponse,
      },
    },
  )
  .post("/verify", async ({ body, set }) => {});
