import { t } from "elysia";

export namespace VerifyOwnershipModel {
  export const verifyOwnershipRequest = t.Object({
    domain: t.String(),
    clerkId: t.String(),
  });

  export type verifyOwnershipRequest = typeof verifyOwnershipRequest.static;

  export const verifyOwnershipResponse = t.Object({
    secretKey: t.String(),
  });

  export type verifyOwnershipResponse = typeof verifyOwnershipResponse.static;

  export const verifyOwnershipFailedResponse = t.Object({
    message: t.Literal("Failed to Generate Secret Key"),
  });

  export type verifyOwnershipFailedResponse =
    typeof verifyOwnershipFailedResponse.static;

  export const scanTXTRequest = t.Object({
    domain: t.String(),
    secretKey: t.String(),
  });

  export type scanTXTRequest = typeof scanTXTRequest.static;
}
