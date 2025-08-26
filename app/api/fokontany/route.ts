import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const fokontany = await prisma.fokontany.findMany({
      select: {
        fokontanyId: true,
        nom: true,
        codeFokontany: true,
        _count: {
          select: {
            personne: true, 
          },
        },
      },
    });

    const formattedData = fokontany.map((f) => ({
      id: f.fokontanyId,
      nom: f.nom,
      codeFokontany: f.codeFokontany,
      totalPersonnes: f._count.personne,
    }));

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching fokontany:", error);
    return NextResponse.json({ error: "Failed to fetch fokontany" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async  function POST(request: Request) {
  try {
    const body = await request.json();
    const { codeFokontany, nom } = body;

    const newFokontany = await prisma.fokontany.create({
      data: {
        codeFokontany,
        nom, 
      },
    });
    return NextResponse.json(newFokontany);
  } catch (error) {
    console.error("Error creating fokontany:", error);
    return NextResponse.json({ error: "Failed to create fokontany" }, { status: 500 }); 
  }
  }

