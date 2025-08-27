import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {

    const { id } = await context.params;

    const fokontanyId = parseInt(id, 10);

    if (!id || isNaN(fokontanyId)) {
      return NextResponse.json({ error: 'Invalid or missing fokontanyId' }, { status: 400 });
    }

    const fokontany = await prisma.fokontany.findUnique({
      where: { fokontanyId },
      select: { nom: true, codeFokontany: true },
    });

    if (!fokontany) {
      return NextResponse.json({ error: "Fokontany n'existe pas" }, { status: 404 });
    }

    const personnes = await prisma.personne.findMany({
      where: {
        fokontany: {
          fokontanyId,
        },
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
      return NextResponse.json({ error: 'No personnes found for this fokontany' }, { status: 404 });
    }

    // Format the response data
    const formattedData = personnes.map((personne) => ({
      personneId: personne.personneId,
      nom: personne.nom,
      prenom: personne.prenom,
      sexe: personne.sexe,
      dateNaissance: personne.dateNaissance,
      lieuDeNaissance: personne.lieuDeNaissance,
      CIN: personne.CIN,
      delivree: personne.delivree,
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
      createdAt: personne.createdAt,
    }));

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error('Error fetching personnes by fokontany:', error);
    return NextResponse.json({ error: 'Failed to fetch personnes' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}