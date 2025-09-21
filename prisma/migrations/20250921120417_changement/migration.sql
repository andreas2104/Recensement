/*
  Warnings:

  - You are about to drop the `HistoriqueFonenana` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `asa` on the `Personne` table. All the data in the column will be lost.
  - You are about to drop the column `delivree` on the `Personne` table. All the data in the column will be lost.
  - You are about to drop the column `fonenanaAnkehitriny` on the `Personne` table. All the data in the column will be lost.
  - You are about to drop the column `fonenanaTaloha` on the `Personne` table. All the data in the column will be lost.
  - You are about to drop the column `lieuDelivree` on the `Personne` table. All the data in the column will be lost.
  - You are about to drop the column `zompirenena` on the `Personne` table. All the data in the column will be lost.
  - Added the required column `adresseActuelle` to the `Personne` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ancienneAdresse` to the `Personne` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateDelivree` to the `Personne` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lieuDelivrence` to the `Personne` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationalite` to the `Personne` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profession` to the `Personne` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "HistoriqueFonenana";
PRAGMA foreign_keys=on;

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
    "statut" TEXT NOT NULL DEFAULT 'ACTIF',
    "estElecteur" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Personne" ("CIN", "contact", "createdAt", "dateNaissance", "estElecteur", "lieuDeNaissance", "nom", "nomMere", "nomPere", "personneId", "prenom", "sexe", "statut") SELECT "CIN", "contact", "createdAt", "dateNaissance", "estElecteur", "lieuDeNaissance", "nom", "nomMere", "nomPere", "personneId", "prenom", "sexe", "statut" FROM "Personne";
DROP TABLE "Personne";
ALTER TABLE "new_Personne" RENAME TO "Personne";
CREATE UNIQUE INDEX "Personne_CIN_key" ON "Personne"("CIN");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
