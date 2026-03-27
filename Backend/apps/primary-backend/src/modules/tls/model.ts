import { t } from "elysia";

export namespace TlsModel {
  export const tlsRequestSchema = t.Object({
    domain: t.String(),
    clerkId: t.String(),
  });
  export type tlsRequestSchema = typeof tlsRequestSchema.static;

  export const tlsResponseSchema = t.Object({
    valid: t.String(),
    daysRemaining: t.Number(),
    issuer: t.String(),
    protocol: t.String(),
  });
  export type tlsResponseSchema = typeof tlsResponseSchema.static;

  export const tlsFailedResponseSchema = t.Object({
    message: t.Literal("Connection Failed!!!"),
  });
  export type tlsFailedResponseSchema = typeof tlsFailedResponseSchema.static;
}
