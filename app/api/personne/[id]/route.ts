import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface Params {
  id: string;
}

export async function GET(request:NextApiRequest, { params }: {params: Params}) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
    }

    const personne = await prisma.personne.findUnique({
      where: {
        personneId: parseInt(id)
      },
      include: {
        fokontany: {
          select: {
            nom: true,
          },
        },
      },
    });

    if (!personne) {
      return NextResponse.json({ error: "Personne not found" }, { status: 404 });
    }

    const formatData = {
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
      },
      createdAt: personne.createdAt
    };

    return NextResponse.json(formatData);
  } catch (error) {
    console.error("Error fetching personne by ID:", error);
    return NextResponse.json({ error: "Failed to fetch personne" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest, { params }: {params: Params}) {
  try {
    const parsedId = parseInt(params.id, 10);
    const body = await request.json();

    if (isNaN(parsedId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const requiredFields = [
      "nom", "prenom", "sexe", "dateNaissance", "lieuDeNaissance",
      "CIN", "delivree", "lieuDelivree", "asa", "nomPere", "nomMere",
      "fonenanaAnkehitriny", "fonenanaTaloha", "zompirenena", "contact",
      "nomFokontany",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(", ")}` }, { status: 400 });
    }

    const parsedDateNaissance = new Date(body.dateNaissance);
    const parsedDelivree = new Date(body.delivree);
    if (isNaN(parsedDateNaissance.getTime()) || isNaN(parsedDelivree.getTime())) {
      return NextResponse.json({ error: "Invalid date format for dateNaissance or delivree" }, { status: 400 });
    }
    if (!["M", "F"].includes(body.sexe)) {
      return NextResponse.json({ error: "Invalid sexe value. Must be 'M' or 'F'" }, { status: 400 });
    }

    const fokontany = await prisma.fokontany.findFirst({
      where: { nom: body.nomFokontany },
    });
    if (!fokontany) {
      return NextResponse.json({ error: `Fokontany with name '${body.nomFokontany}' not found.` }, { status: 404 });
    }

    const updatedPersonne = await prisma.personne.update({
      where: { personneId: parsedId },
      data: {
        nom: body.nom,
        prenom: body.prenom,
        sexe: body.sexe,
        dateNaissance: parsedDateNaissance,
        lieuDeNaissance: body.lieuDeNaissance,
        CIN: body.CIN,
        delivree: parsedDelivree,
        lieuDelivree: body.lieuDelivree,
        asa: body.asa,
        nomPere: body.nomPere,
        nomMere: body.nomMere,
        fonenanaAnkehitriny: body.fonenanaAnkehitriny,
        fonenanaTaloha: body.fonenanaTaloha,
        zompirenena: body.zompirenena,
        contact: body.contact,
        fokontanyId: fokontany.fokontanyId,
      },
      include: {
        fokontany: {
          select: { nom: true },
        },
      },
    });

  
    const formatData = {
      personneId: updatedPersonne.personneId,
      nom: updatedPersonne.nom,
      prenom: updatedPersonne.prenom,
      sexe: updatedPersonne.sexe,
      dateNaissance: updatedPersonne.dateNaissance,
      lieuDeNaissance: updatedPersonne.lieuDeNaissance,
      CIN: updatedPersonne.CIN,
      delivree: updatedPersonne.delivree,
      lieuDelivree: updatedPersonne.lieuDelivree,
      asa: updatedPersonne.asa,
      nomPere: updatedPersonne.nomPere,
      nomMere: updatedPersonne.nomMere,
      fonenanaAnkehitriny: updatedPersonne.fonenanaAnkehitriny,
      fonenanaTaloha: updatedPersonne.fonenanaTaloha,
      zompirenena: updatedPersonne.zompirenena,
      contact: updatedPersonne.contact,
      fokontany: {
        nom: updatedPersonne.fokontany?.nom || null,
      },
      createdAt: updatedPersonne.createdAt
    };

    return NextResponse.json(formatData, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Personne not found" }, { status: 404 });
    }
    console.error("Error updating personne:", error, error?.message);
    return NextResponse.json({ error: "Failed to update personne", details: error?.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


export async function DELETE(_request: NextApiRequest, { params }: {params:Params}) {
  try {
    const parsedId = parseInt(params.id, 10);

    if (isNaN(parsedId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    await prisma.personne.delete({
      where: { personneId: parsedId },
    });

    return NextResponse.json({ message: "Personne successfully deleted" }, { status: 200 });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Personne not found" }, { status: 404 });
    }
    console.error("Error deleting personne:", error);
    return NextResponse.json({ error: "Failed to delete personne" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GetpersonneByFokontany(CIN: string, nom: string, fokontanyId: number) {
  const personnes = await prisma.personne.findMany({
    where: {
      fokontanyId: fokontanyId,
      CIN: {
        contains: CIN,
      },
      nom: {
        contains: nom,
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
  return personnes;
}