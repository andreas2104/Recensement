-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'AGENT',
    "centerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailVerified" DATETIME
);

-- CreateTable
CREATE TABLE "Commune" (
    "communeId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Fokontany" (
    "fonkotanyId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "communeId" INTEGER NOT NULL,
    CONSTRAINT "Fokontany_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "Commune" ("communeId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Famille" (
    "familleId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "fonkotanyId" INTEGER NOT NULL,
    CONSTRAINT "Famille_fonkotanyId_fkey" FOREIGN KEY ("fonkotanyId") REFERENCES "Fokontany" ("fonkotanyId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Personne" (
    "personneId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "CIN" TEXT NOT NULL,
    "dateNaissance" DATETIME NOT NULL,
    "familleId" INTEGER NOT NULL,
    CONSTRAINT "Personne_familleId_fkey" FOREIGN KEY ("familleId") REFERENCES "Famille" ("familleId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_contact_key" ON "User"("contact");
