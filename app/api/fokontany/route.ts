import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.fokontany.findMany();
    const formatData = data.map(data => ({
      fokontanyId: data.fokontanyId,
      nom: data.nom,
      createdAt: data.createdAt,
    }));
    return NextResponse.json(formatData);
  }catch (error) {
    console.error("Error fetching fokontany:", error);
    return NextResponse.json({ error: "Failed to fetch fokontany" }, { status: 500 });
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

