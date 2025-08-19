/*
  Warnings:

  - Added the required column `asa` to the `Personne` table without a default value. This is not possible if the table is not empty.
  - Added the required column `delivree` to the `Personne` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fokontanyId` to the `Personne` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fonenanaAnkehitriny` to the `Personne` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fonenanaTaloha` to the `Personne` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lieuDeNaissance` to the `Personne` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lieuDelivree` to the `Personne` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sexe` to the `Personne` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zompirenena` to the `Personne` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Famille" (
    "familleId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fokontanyId" INTEGER NOT NULL
);
INSERT INTO "new_Famille" ("createdAt", "familleId", "fokontanyId", "nom") SELECT "createdAt", "familleId", "fokontanyId", "nom" FROM "Famille";
DROP TABLE "Famille";
ALTER TABLE "new_Famille" RENAME TO "Famille";
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
    "fonenanaAnkehitriny" TEXT NOT NULL,
    "fonenanaTaloha" TEXT NOT NULL,
    "zompirenena" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contact" TEXT NOT NULL,
    "familleId" INTEGER NOT NULL,
    "fokontanyId" INTEGER NOT NULL,
    CONSTRAINT "Personne_fokontanyId_fkey" FOREIGN KEY ("fokontanyId") REFERENCES "Fokontany" ("fokontanyId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Personne" ("CIN", "contact", "createdAt", "dateNaissance", "familleId", "nom", "personneId", "prenom") SELECT "CIN", "contact", "createdAt", "dateNaissance", "familleId", "nom", "personneId", "prenom" FROM "Personne";
DROP TABLE "Personne";
ALTER TABLE "new_Personne" RENAME TO "Personne";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
