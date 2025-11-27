/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Admin_contact_key";

-- DropIndex
DROP INDEX "Admin_email_key";

-- DropIndex
DROP INDEX "Admin_nom_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Admin";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "User" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionId" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Personne" (
    "personneId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "sexe" TEXT NOT NULL,
    "dateNaissance" DATETIME NOT NULL,
    "lieuDeNaissance" TEXT NOT NULL,
    "CIN" TEXT NOT NULL,
    "dateDelivree" DATETIME NOT NULL,
    "lieuDelivrence" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "nomPere" TEXT,
    "nomMere" TEXT,
    "adresseActuelle" TEXT NOT NULL,
    "ancienneAdresse" TEXT NOT NULL,
    "nationalite" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "situation" TEXT NOT NULL DEFAULT 'CELIBATAIRE',
    "statut" TEXT NOT NULL DEFAULT 'ACTIF',
    "estElecteur" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Personne" ("CIN", "adresseActuelle", "ancienneAdresse", "contact", "createdAt", "dateDelivree", "dateNaissance", "estElecteur", "lieuDeNaissance", "lieuDelivrence", "nationalite", "nom", "nomMere", "nomPere", "personneId", "prenom", "profession", "sexe", "statut") SELECT "CIN", "adresseActuelle", "ancienneAdresse", "contact", "createdAt", "dateDelivree", "dateNaissance", "estElecteur", "lieuDeNaissance", "lieuDelivrence", "nationalite", "nom", "nomMere", "nomPere", "personneId", "prenom", "profession", "sexe", "statut" FROM "Personne";
DROP TABLE "Personne";
ALTER TABLE "new_Personne" RENAME TO "Personne";
CREATE UNIQUE INDEX "Personne_CIN_key" ON "Personne"("CIN");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
