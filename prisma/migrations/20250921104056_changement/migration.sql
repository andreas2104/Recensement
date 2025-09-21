/*
  Warnings:

  - You are about to drop the `Famille` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Fokontany` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `fokontanyId` on the `Personne` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Fokontany_codeFokontany_key";

-- DropIndex
DROP INDEX "User_contact_key";

-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Famille";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Fokontany";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Admin" (
    "adminId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "HistoriqueFonenana" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personneId" INTEGER NOT NULL,
    "adresse" TEXT NOT NULL,
    "dateDebut" DATETIME NOT NULL,
    "dateFin" DATETIME,
    "fokontany" TEXT,
    CONSTRAINT "HistoriqueFonenana_personneId_fkey" FOREIGN KEY ("personneId") REFERENCES "Personne" ("personneId") ON DELETE CASCADE ON UPDATE CASCADE
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
    "delivree" DATETIME NOT NULL,
    "lieuDelivree" TEXT NOT NULL,
    "asa" TEXT NOT NULL,
    "nomPere" TEXT,
    "nomMere" TEXT,
    "fonenanaAnkehitriny" TEXT NOT NULL,
    "fonenanaTaloha" TEXT NOT NULL,
    "zompirenena" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'ACTIF',
    "estElecteur" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Personne" ("CIN", "asa", "contact", "createdAt", "dateNaissance", "delivree", "fonenanaAnkehitriny", "fonenanaTaloha", "lieuDeNaissance", "lieuDelivree", "nom", "nomMere", "nomPere", "personneId", "prenom", "sexe", "zompirenena") SELECT "CIN", "asa", "contact", "createdAt", "dateNaissance", "delivree", "fonenanaAnkehitriny", "fonenanaTaloha", "lieuDeNaissance", "lieuDelivree", "nom", "nomMere", "nomPere", "personneId", "prenom", "sexe", "zompirenena" FROM "Personne";
DROP TABLE "Personne";
ALTER TABLE "new_Personne" RENAME TO "Personne";
CREATE UNIQUE INDEX "Personne_CIN_key" ON "Personne"("CIN");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_nom_key" ON "Admin"("nom");
