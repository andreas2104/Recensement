import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID invalide", details: "L'ID doit être un nombre" },
        { status: 400 }
      );
    }

    const person = await prisma.person.findUnique({
      where: { personId: id },
      // Optionnel : sélectionner les champs spécifiques si besoin
      // select: {
      //   personId: true,
      //   firstName: true,
      //   lastName: true,
      //   // ... autres champs
      // }
    });
    if (!person) {
      return NextResponse.json(
        {
          error: "Personne non trouvée",
          details: `Aucune personne avec l'ID ${id}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(person);
  } catch (error: any) {
    console.error("Erreur GET personne:", error);
    return NextResponse.json(
      {
        error: "Échec de récupération de la personne",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const body = await request.json();

    // Vérifier si la personne existe
    const existingPerson = await prisma.person.findUnique({
      where: { personId: id },
    });

    if (!existingPerson) {
      return NextResponse.json(
        { error: "Personne non trouvée" },
        { status: 404 }
      );
    }

    if (body.nationalId && body.nationalId !== existingPerson.nationalId) {
      const existingWithSameNationalId = await prisma.person.findUnique({
        where: { nationalId: body.nationalId },
      });

      if (existingWithSameNationalId) {
        return NextResponse.json(
          { error: "Cette CIN est déjà utilisée par une autre personne" },
          { status: 409 }
        );
      }
    }

    const updatedPerson = await prisma.person.update({
      where: { personId: id },
      data: body,
    });

    return NextResponse.json(
      { message: "Personne mise à jour avec succès", data: updatedPerson },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur PUT personne:", error);
    return NextResponse.json(
      {
        error: "Échec de la mise à jour de la personne",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }
    // Vérifier si la personne existe
    const existingPerson = await prisma.person.findUnique({
      where: { personId: id },
    });

    if (!existingPerson) {
      return NextResponse.json(
        { error: "Personne non trouvée" },
        { status: 404 }
      );
    }

    // Supprimer la personne
    await prisma.person.delete({
      where: { personId: id },
    });

    return NextResponse.json(
      { message: "Personne supprimée avec succès" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur DELETE personne:", error);
    return NextResponse.json(
      {
        error: "Échec de la suppression de la personne",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
