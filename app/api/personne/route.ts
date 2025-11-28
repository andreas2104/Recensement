import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const handleError = (error: any, message: string, status: number = 500) => {
  console.error("API Error:", error);
  return NextResponse.json(
    { error: message, details: error.message },
    { status }
  );
};

export async function GET(req: NextRequest) {
  try {
    const currentUserId = req.headers.get("x-user-id"); // ID du user connecté
    const currentUserRole = req.headers.get("x-user-role"); // ADMIN | USER

    if (!currentUserId || !currentUserRole) {
      return NextResponse.json(
        { error: "Unauthorized: missing headers" },
        { status: 401 }
      );
    }

    let persons;

    // 🔓 ADMIN → peut tout voir
    if (currentUserRole === "ADMIN") {
      persons = await prisma.person.findMany({
        orderBy: { personId: "asc" },
      });

      return NextResponse.json(persons);
    }

    // 🔒 USER → peut voir uniquement son propre enregistrement
    persons = await prisma.person.findMany({
      where: { personId: Number(currentUserId) },
    });

    return NextResponse.json(persons);
  } catch (error) {
    return handleError(error, "Failed to fetch persons");
  }
}

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     const {
//       nom,
//       prenom,
//       sexe,
//       dateNaissance,
//       lieuDeNaissance,
//       CIN,
//       dateDelivree,
//       lieuDelivrence,
//       profession,
//       nomPere,
//       nomMere,
//       adresseActuelle,
//       ancienneAdresse,
//       nationalite,
//       contact,
//       statut = "ACTIF",
//       estElecteur = false,
//     } = body;

//     // Champs obligatoires
//     const requiredFields = [
//       "nom", "prenom", "sexe", "dateNaissance", "lieuDeNaissance",
//       "CIN", "dateDelivree", "lieuDelivrence", "profession",
//       "adresseActuelle", "ancienneAdresse", "nationalite", "contact"
//     ];

//     const missing = requiredFields.filter(f => !body[f]);

//     if (missing.length > 0) {
//       return NextResponse.json(
//         {
//           error: "Champs manquants",
//           details: `Champs requis manquants : ${missing.join(", ")}`,
//         },
//         { status: 400 }
//       );
//     }

//     // Validation dates
//     const dNaiss = new Date(dateNaissance);
//     const dDelivr = new Date(dateDelivree);

//     if (isNaN(dNaiss.getTime()) || isNaN(dDelivr.getTime())) {
//       return NextResponse.json(
//         {
//           error: "Format de date invalide",
//           details: "dateNaissance ou dateDelivree n'est pas une date valide",
//         },
//         { status: 400 }
//       );
//     }

//     // Validation sexe
//     if (!["M", "F"].includes(sexe)) {
//       return NextResponse.json(
//         { error: "Sexe invalide", details: "Le sexe doit être 'M' ou 'F'" },
//         { status: 400 }
//       );
//     }

//     // Validation statut
//     if (!Object.values(Statut).includes(statut)) {
//       return NextResponse.json(
//         {
//           error: "Statut invalide",
//           details: `Statut doit être : ${Object.values(Statut).join(", ")}`,
//         },
//         { status: 400 }
//       );
//     }

//     // Création en base
//     const newPersonne = await prisma.personne.create({
//       data: {
//         nom,
//         prenom,
//         sexe,
//         dateNaissance: dNaiss,
//         lieuDeNaissance,
//         CIN,
//         dateDelivree: dDelivr,
//         lieuDelivrence,
//         profession,
//         nomPere: nomPere ?? null,
//         nomMere: nomMere ?? null,
//         adresseActuelle,
//         ancienneAdresse,
//         nationalite,
//         contact,
//         statut,
//         estElecteur,
//       },
//     });

//     return NextResponse.json(
//       {
//         message: "Personne créée avec succès",
//         data: newPersonne,
//       },
//       { status: 201 }
//     );

//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         error: "Échec de création de la personne",
//         details: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }
