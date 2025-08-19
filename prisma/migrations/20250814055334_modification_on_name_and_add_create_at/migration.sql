/*
  Warnings:

  - You are about to drop the column `fonkotanyId` on the `Famille` table. All the data in the column will be lost.
  - The primary key for the `Fokontany` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fonkotanyId` on the `Fokontany` table. All the data in the column will be lost.
  - Added the required column `fokontanyId` to the `Famille` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codeFokontany` to the `Fokontany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fokontanyId` to the `Fokontany` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Commune" (
    "communeId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Commune" ("communeId", "nom") SELECT "communeId", "nom" FROM "Commune";
DROP TABLE "Commune";
ALTER TABLE "new_Commune" RENAME TO "Commune";
CREATE TABLE "new_Famille" (
    "familleId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fokontanyId" INTEGER NOT NULL,
    CONSTRAINT "Famille_fokontanyId_fkey" FOREIGN KEY ("fokontanyId") REFERENCES "Fokontany" ("fokontanyId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Famille" ("familleId", "nom") SELECT "familleId", "nom" FROM "Famille";
DROP TABLE "Famille";
ALTER TABLE "new_Famille" RENAME TO "Famille";
CREATE TABLE "new_Fokontany" (
    "fokontanyId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codeFokontany" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "communeId" INTEGER NOT NULL,
    CONSTRAINT "Fokontany_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "Commune" ("communeId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Fokontany" ("communeId", "nom") SELECT "communeId", "nom" FROM "Fokontany";
DROP TABLE "Fokontany";
ALTER TABLE "new_Fokontany" RENAME TO "Fokontany";
CREATE UNIQUE INDEX "Fokontany_codeFokontany_key" ON "Fokontany"("codeFokontany");
CREATE TABLE "new_Personne" (
    "personneId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "CIN" TEXT NOT NULL,
    "dateNaissance" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "familleId" INTEGER NOT NULL,
    CONSTRAINT "Personne_familleId_fkey" FOREIGN KEY ("familleId") REFERENCES "Famille" ("familleId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Personne" ("CIN", "contact", "dateNaissance", "familleId", "nom", "personneId", "prenom") SELECT "CIN", "contact", "dateNaissance", "familleId", "nom", "personneId", "prenom" FROM "Personne";
DROP TABLE "Personne";
ALTER TABLE "new_Personne" RENAME TO "Personne";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
