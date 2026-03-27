import crypto from "crypto";
import { prisma } from "../../../../../packages/db";
import dns from "dns/promises";
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

    const domainVerify = await prisma.domain.create({
      data: {
        domainName: domain,
        secretKey,
        userId: user.id,
      },
    });
    if (domainVerify) {
      return secretKey;
    }
  };

  static scanTXT = async (domain: string, expectedKey: string) => {
    try {
      const records = await dns.resolveTxt(domain);

      const flatRecords = records.map((record) => record.join("").trim());

      const verified = flatRecords.some((txt) => txt === expectedKey);

      if (!verified) {
        throw new Error("Domain is not verified");
      }

      if (verified) {
        await prisma.domain.update({
          where: {
            secretKey: expectedKey,
          },
          data: {
            isVerified: true,
          },
        });
      }

      return {
        success: true,
        messge: "Your Ownership is Verified",
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  };
}
