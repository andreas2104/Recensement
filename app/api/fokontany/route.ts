// /api/fokontany/route.ts

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET: Récupérer la liste de tous les fokontany
export async function GET() {
  try {
    const fokontany = await prisma.fokontany.findMany({
      select: {
        fokontanyId: true,
        nom: true,
        codeFokontany: true,
        createdAt: true,
        _count: {
          select: {
            personne: true,
          },
        },
      },
    });

    const formattedData = fokontany.map((f) => ({
      fokontanyId: f.fokontanyId,
      nom: f.nom,
      codeFokontany: f.codeFokontany,
      createdAt: f.createdAt, 
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { codeFokontany, nom } = body;

    if (!codeFokontany || !nom) {
      return NextResponse.json({ error: "CodeFokontany and nom are required" }, { status: 400 });
    }

    const newFokontany = await prisma.fokontany.create({
      data: {
        codeFokontany,
        nom,
      },
    });

    return NextResponse.json(newFokontany, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating fokontany:", error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'CodeFokontany already exists' }, { status: 409 });
    }
    
    return NextResponse.json({ error: "Failed to create fokontany" }, { status: 500 });
  }
}