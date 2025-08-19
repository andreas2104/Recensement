import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const handleError = (error: any, message: string, status:number = 500) => {
  console.error("API Error:", error);
  return NextResponse.json({ error: message, details: error.message}, {status});
}

export async function GET() {
  try {
    const personnes = await prisma.personne.findMany({
      include: {
        fokontany:true,
      }
    });
    return NextResponse.json(personnes);
  } catch (error) {
    return handleError(error,"Failed to fetch data");
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nom,
      prenom,
      sexe,
      dateNaissance,
      lieuDeNaissance,
      CIN,
      delivree,
      lieuDelivree,
      asa,
      nomPere,
      nomMere,
      fonenanaAnkehitriny,
      fonenanaTaloha,
      zompirenena,
      contact,
      nomFokontany,
    } = body;

   
    const requiredFields = [
      "nom", "prenom", "sexe", "dateNaissance", "lieuDeNaissance",
      "CIN", "delivree", "lieuDelivree", "asa", "nomPere", "nomMere",
      "fonenanaAnkehitriny", "fonenanaTaloha", "zompirenena", "contact",
      "nomFokontany",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return handleError(new Error("Missing data"), `Missing required fields: ${missingFields.join(", ")}`, 400);
    }
    
    const parsedDateNaissance = new Date(dateNaissance);
    const parsedDelivree = new Date(delivree);
    if (isNaN(parsedDateNaissance.getTime()) || isNaN(parsedDelivree.getTime())) {
      return handleError(new Error("Invalid date"), "Invalid date format for dateNaissance or delivree.", 400);
    }
    if (!["M", "F"].includes(sexe)) {
      return handleError(new Error("Invalid sex"), "Invalid sexe value. Must be 'M' or 'F'.", 400);
    }


    const newPersonne = await prisma.$transaction(async (tx) => {
 
      const fokontany = await tx.fokontany.findFirst({
        where: { nom: nomFokontany },
      });
      if (!fokontany) {
        return handleError(new Error("Fokontany not found"), `Fokontany with name '${nomFokontany}' not found.`, 404);
      }

      return tx.personne.create({
        data: {
          nom,
          prenom,
          sexe,
          dateNaissance: parsedDateNaissance,
          lieuDeNaissance,
          CIN,
          delivree: parsedDelivree,
          lieuDelivree,
          asa,
          nomPere,
          nomMere,
          fonenanaAnkehitriny,
          fonenanaTaloha,
          zompirenena,
          contact,
          fokontanyId: fokontany.fokontanyId,
        },
      });
    });

    return NextResponse.json(newPersonne, { status: 201 });
  } catch (error) {
    return handleError(error, "Failed to create person.");
  } finally {
    await prisma.$disconnect();
  }
}
