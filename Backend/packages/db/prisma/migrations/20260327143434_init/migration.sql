/*
  Warnings:

  - You are about to drop the `VerifyOwnership` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VerifyOwnership" DROP CONSTRAINT "VerifyOwnership_userId_fkey";

-- DropTable
DROP TABLE "VerifyOwnership";

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "domainName" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DomainSSL" (
    "id" TEXT NOT NULL,
    "valid" TEXT NOT NULL,
    "daysRemaining" INTEGER NOT NULL,
    "issuer" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "DomainSSL_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Domain_secretKey_key" ON "Domain"("secretKey");

-- CreateIndex
CREATE INDEX "Domain_domainName_idx" ON "Domain"("domainName");

-- CreateIndex
CREATE UNIQUE INDEX "DomainSSL_domainId_key" ON "DomainSSL"("domainId");

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainSSL" ADD CONSTRAINT "DomainSSL_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;
