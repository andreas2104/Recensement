import { PrismaClient, Statut } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const handleError = (error: any, message: string, status: number = 500) => {
  console.error("API Error:", error);
  return NextResponse.json({ error: message, details: error.message }, { status });
};

// ✅ Récupérer toutes les personnes
export async function GET() {
  try {
    const personnes = await prisma.personne.findMany();
    return NextResponse.json(personnes);
  } catch (error) {
    return handleError(error, "Échec de récupération des personnes");
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      nom,
      prenom,
      sexe,
      dateNaissance,
      lieuDeNaissance,
      CIN,
      dateDelivree,
      lieuDelivrence,
      profession,
      nomPere,
      nomMere,
      adresseActuelle,
      ancienneAdresse,
      nationalite,
      contact,
      statut = "ACTIF",
      estElecteur = false,
    } = body;

    // Vérification des champs obligatoires
    const requiredFields = [
      "nom", "prenom", "sexe", "dateNaissance", "lieuDeNaissance",
      "CIN", "dateDelivree", "lieuDelivrence", "profession",
      "adresseActuelle", "ancienneAdresse", "nationalite", "contact"
    ];
    const missingFields = requiredFields.filter(f => !body[f]);
    if (missingFields.length > 0) {
      return handleError(
        new Error("Champs manquants"),
        `Champs requis manquants : ${missingFields.join(", ")}`,
        400
      );
    }

    // Validation des dates
    const parsedDateNaissance = new Date(dateNaissance);
    const parsedDateDelivree = new Date(dateDelivree);
    if (isNaN(parsedDateNaissance.getTime()) || isNaN(parsedDateDelivree.getTime())) {
      return handleError(
        new Error("Format de date invalide"),
        "Format de date invalide pour dateNaissance ou dateDelivree",
        400
      );
    }

    // Validation sexe
    if (!["M", "F"].includes(sexe)) {
      return handleError(
        new Error("Sexe invalide"),
        "Le sexe doit être 'M' ou 'F'",
        400
      );
    }

    // Validation statut
    if (!Object.values(Statut).includes(statut as Statut)) {
      return handleError(
        new Error("Statut invalide"),
        `Statut invalide. Doit être : ${Object.values(Statut).join(", ")}`,
        400
      );
    }

    // Création de la personne
    const newPersonne = await prisma.personne.create({
      data: {
        nom,
        prenom,
        sexe,
        dateNaissance: parsedDateNaissance,
        lieuDeNaissance,
        CIN,
        dateDelivree: parsedDateDelivree,
        lieuDelivrence,
        profession,
        nomPere: nomPere ?? null,
        nomMere: nomMere ?? null,
        adresseActuelle,
        ancienneAdresse,
        nationalite,
        contact,
        statut,
        estElecteur,
      },
    });

    return NextResponse.json(newPersonne, { status: 201 });
  } catch (error: any) {
    return handleError(error, "Échec de création de la personne");
  } finally {
    await prisma.$disconnect();
  }
}
