import { PrismaClient, Statut } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface Params {
  id: string;
}

// ✅ Récupérer une personne par ID
export async function GET(_request: NextRequest, { params }: { params: Params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const personne = await prisma.personne.findUnique({
      where: { personneId: id },
    });

    if (!personne) {
      return NextResponse.json({ error: "Personne non trouvée" }, { status: 404 });
    }

    return NextResponse.json(personne);
  } catch (error) {
    console.error("Erreur GET personne:", error);
    return NextResponse.json({ error: "Échec de récupération de la personne" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// ✅ Mettre à jour une personne
export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const body = await request.json();

    // Validation minimale des champs requis
    const requiredFields = [
      "nom", "prenom", "sexe", "dateNaissance", "lieuDeNaissance",
      "CIN", "dateDelivree", "lieuDelivrence", "profession",
      "adresseActuelle", "ancienneAdresse", "nationalite", "contact", "statut"
    ];
    const missing = requiredFields.filter(f => !body[f]);
    if (missing.length > 0) {
      return NextResponse.json({ error: `Champs manquants : ${missing.join(", ")}` }, { status: 400 });
    }

    // Validation des dates
    const dateNaissance = new Date(body.dateNaissance);
    const dateDelivree = new Date(body.dateDelivree);
    if (isNaN(dateNaissance.getTime()) || isNaN(dateDelivree.getTime())) {
      return NextResponse.json({ error: "Format de date invalide" }, { status: 400 });
    }

    // Validation du sexe
    if (!["M", "F"].includes(body.sexe)) {
      return NextResponse.json({ error: "Le sexe doit être 'M' ou 'F'" }, { status: 400 });
    }

    // Validation du statut
    if (!Object.values(Statut).includes(body.statut)) {
      return NextResponse.json({ error: `Statut invalide. Doit être : ${Object.values(Statut).join(", ")}` }, { status: 400 });
    }

    const updatedPersonne = await prisma.personne.update({
      where: { personneId: id },
      data: {
        nom: body.nom,
        prenom: body.prenom,
        sexe: body.sexe,
        dateNaissance,
        lieuDeNaissance: body.lieuDeNaissance,
        CIN: body.CIN,
        dateDelivree,
        lieuDelivrence: body.lieuDelivrence,
        profession: body.profession,
        nomPere: body.nomPere ?? null,
        nomMere: body.nomMere ?? null,
        adresseActuelle: body.adresseActuelle,
        ancienneAdresse: body.ancienneAdresse,
        nationalite: body.nationalite,
        contact: body.contact,
        statut: body.statut,
        estElecteur: body.estElecteur ?? false,
      },
    });

    return NextResponse.json(updatedPersonne, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Personne non trouvée" }, { status: 404 });
    }
    console.error("Erreur PUT personne:", error);
    return NextResponse.json({ error: "Échec de mise à jour", details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// ✅ Supprimer une personne
export async function DELETE(_request: NextRequest, { params }: { params: Params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    await prisma.personne.delete({
      where: { personneId: id },
    });

    return NextResponse.json({ message: "Personne supprimée avec succès" }, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Personne non trouvée" }, { status: 404 });
    }
    console.error("Erreur DELETE personne:", error);
    return NextResponse.json({ error: "Échec de suppression" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
