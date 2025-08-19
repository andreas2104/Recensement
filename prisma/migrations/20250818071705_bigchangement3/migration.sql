/*
  Warnings:

  - You are about to drop the `Commune` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `communeId` on the `Fokontany` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Commune";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Fokontany" (
    "fokontanyId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codeFokontany" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Fokontany" ("codeFokontany", "createdAt", "fokontanyId", "nom") SELECT "codeFokontany", "createdAt", "fokontanyId", "nom" FROM "Fokontany";
DROP TABLE "Fokontany";
ALTER TABLE "new_Fokontany" RENAME TO "Fokontany";
CREATE UNIQUE INDEX "Fokontany_codeFokontany_key" ON "Fokontany"("codeFokontany");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
