import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface Params {
  fokontanyId: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const fokontanyId = parseInt(params.fokontanyId, 10);

    if (isNaN(fokontanyId)) {
      return NextResponse.json({ error: "Invalid fokontanyId format" }, { status: 400 });
    }

    // Vérifier si le fokontany existe
    const fokontany = await prisma.fokontany.findUnique({
      where: { id: fokontanyId },
      select: { nom: true, codeFokontany: true },
    });

    if (!fokontany) {
      return NextResponse.json({ error: "Fokontany n'existe pas" }, { status: 404 });
    }

    const personnes = await prisma.personne.findMany({
      where: {
        fokontanyId: fokontanyId,
      },
      include: {
        fokontany: {
          select: {
            nom: true,
            codeFokontany: true,
          },
        },
      },
    });

    if (!personnes || personnes.length === 0) {
      return NextResponse.json({ error: "No personnes found for this fokontany" }, { status: 404 });
    }

    const formattedData = personnes.map((personne) => ({
      personneId: personne.personneId,
      nom: personne.nom,
      prenom: personne.prenom,
      sexe: personne.sexe,
      dateNaissance: personne.dateNaissance.toISOString(),
      lieuDeNaissance: personne.lieuDeNaissance,
      CIN: personne.CIN,
      delivree: personne.delivree.toISOString(),
      lieuDelivree: personne.lieuDelivree,
      asa: personne.asa,
      nomPere: personne.nomPere,
      nomMere: personne.nomMere,
      fonenanaAnkehitriny: personne.fonenanaAnkehitriny,
      fonenanaTaloha: personne.fonenanaTaloha,
      zompirenena: personne.zompirenena,
      contact: personne.contact,
      fokontany: {
        nom: personne.fokontany?.nom || null,
        codeFokontany: personne.fokontany?.codeFokontany || null,
      },
      createdAt: personne.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching personnes by fokontany:", error);
    return NextResponse.json({ error: "Failed to fetch personnes" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}