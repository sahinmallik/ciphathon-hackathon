/*
  Warnings:

  - A unique constraint covering the columns `[secretKey]` on the table `VerifyOwnership` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VerifyOwnership_secretKey_key" ON "VerifyOwnership"("secretKey");
