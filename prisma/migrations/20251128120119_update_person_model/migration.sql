/*
  Warnings:

  - You are about to drop the `Personne` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Personne";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Person" (
    "personId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "birthPlace" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "issuedDate" DATETIME NOT NULL,
    "issuedPlace" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "fatherName" TEXT,
    "motherName" TEXT,
    "currentAddress" TEXT NOT NULL,
    "previousAddress" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL DEFAULT 'CELIBATAIRE',
    "status" TEXT NOT NULL DEFAULT 'ACTIF',
    "isVoter" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_nationalId_key" ON "Person"("nationalId");
