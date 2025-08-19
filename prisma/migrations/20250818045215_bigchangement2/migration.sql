/*
  Warnings:

  - You are about to drop the column `familleId` on the `Personne` table. All the data in the column will be lost.

*/
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
    "fonenanaAnkehitriny" TEXT NOT NULL,
    "fonenanaTaloha" TEXT NOT NULL,
    "zompirenena" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contact" TEXT NOT NULL,
    "fokontanyId" INTEGER NOT NULL,
    CONSTRAINT "Personne_fokontanyId_fkey" FOREIGN KEY ("fokontanyId") REFERENCES "Fokontany" ("fokontanyId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Personne" ("CIN", "asa", "contact", "createdAt", "dateNaissance", "delivree", "fokontanyId", "fonenanaAnkehitriny", "fonenanaTaloha", "lieuDeNaissance", "lieuDelivree", "nom", "personneId", "prenom", "sexe", "zompirenena") SELECT "CIN", "asa", "contact", "createdAt", "dateNaissance", "delivree", "fokontanyId", "fonenanaAnkehitriny", "fonenanaTaloha", "lieuDeNaissance", "lieuDelivree", "nom", "personneId", "prenom", "sexe", "zompirenena" FROM "Personne";
DROP TABLE "Personne";
ALTER TABLE "new_Personne" RENAME TO "Personne";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
