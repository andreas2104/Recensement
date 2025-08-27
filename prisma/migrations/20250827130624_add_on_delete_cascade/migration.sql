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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contact" TEXT NOT NULL,
    "fokontanyId" INTEGER NOT NULL,
    CONSTRAINT "Personne_fokontanyId_fkey" FOREIGN KEY ("fokontanyId") REFERENCES "Fokontany" ("fokontanyId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Personne" ("CIN", "asa", "contact", "createdAt", "dateNaissance", "delivree", "fokontanyId", "fonenanaAnkehitriny", "fonenanaTaloha", "lieuDeNaissance", "lieuDelivree", "nom", "nomMere", "nomPere", "personneId", "prenom", "sexe", "zompirenena") SELECT "CIN", "asa", "contact", "createdAt", "dateNaissance", "delivree", "fokontanyId", "fonenanaAnkehitriny", "fonenanaTaloha", "lieuDeNaissance", "lieuDelivree", "nom", "nomMere", "nomPere", "personneId", "prenom", "sexe", "zompirenena" FROM "Personne";
DROP TABLE "Personne";
ALTER TABLE "new_Personne" RENAME TO "Personne";
CREATE UNIQUE INDEX "Personne_CIN_key" ON "Personne"("CIN");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
