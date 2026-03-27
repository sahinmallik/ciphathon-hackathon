-- CreateTable
CREATE TABLE "DomainEmailSecurity" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "spfExists" BOOLEAN NOT NULL,
    "spfRecord" TEXT,
    "dmarcExists" BOOLEAN NOT NULL,
    "dmarcRecord" TEXT,
    "dkimExists" TEXT NOT NULL,
    "dkimRecord" TEXT,
    "dkimSelector" TEXT,
    "dkimNote" TEXT,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "DomainEmailSecurity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DomainEmailSecurity_domainId_key" ON "DomainEmailSecurity"("domainId");

-- AddForeignKey
ALTER TABLE "DomainEmailSecurity" ADD CONSTRAINT "DomainEmailSecurity_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;
