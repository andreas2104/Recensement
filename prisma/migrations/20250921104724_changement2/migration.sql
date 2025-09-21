/*
  Warnings:

  - Added the required column `contact` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Admin" (
    "adminId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Admin" ("adminId", "createdAt", "nom", "password") SELECT "adminId", "createdAt", "nom", "password" FROM "Admin";
DROP TABLE "Admin";
ALTER TABLE "new_Admin" RENAME TO "Admin";
CREATE UNIQUE INDEX "Admin_nom_key" ON "Admin"("nom");
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
CREATE UNIQUE INDEX "Admin_contact_key" ON "Admin"("contact");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
