import crypto from "crypto";
import { prisma } from "../../../../../packages/db";

export abstract class VerifyOwnershipAction {
  static generateSecretKey = async (clerkId: string, domain: string) => {
    const secretKey = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.findFirst({
      where: {
        clerkId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const domainVerify = await prisma.verifyOwnership.create({
      data: {
        domainName: domain,
        secretKey,
        userId: user.id,
      },
    });

    return secretKey;
  };
}
