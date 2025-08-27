import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Params {
  id: string;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const parsedId = parseInt(params.id, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const fokontany = await prisma.fokontany.findUnique({
      where: { fokontanyId: parsedId },
      select: {
        fokontanyId: true,
        nom: true,
        codeFokontany: true,
        createdAt: true,  
        _count: {
          select: { personne: true },
        },
      },
    });

    if (!fokontany) {
      return NextResponse.json({ error: "Fokontany not found" }, { status: 404 });
    }

    return NextResponse.json({
      fokontanyId: fokontany.fokontanyId, 
      nom: fokontany.nom,
      codeFokontany: fokontany.codeFokontany,
      createdAt: fokontany.createdAt,      
      totalPersonnes: fokontany._count.personne,
    });
  } catch (error) {
    console.error("Error fetching fokontany by ID:", error);
    return NextResponse.json({ error: "Failed to fetch fokontany" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const parsedId = parseInt(params.id, 10);
    const body = await request.json();
    const { nom, codeFokontany } = body;

    if (isNaN(parsedId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }
    if (!nom || !codeFokontany) {
      return NextResponse.json({ error: "Nom and codeFokontany are required" }, { status: 400 });
    }

    const updatedFokontany = await prisma.fokontany.update({
      where: { fokontanyId: parsedId },
      data: {
        nom,
        codeFokontany,
      },
    
      select: {
        fokontanyId: true,
        nom: true,
        codeFokontany: true,
        createdAt: true,
        _count: {
          select: { personne: true },
        },
      },
    });

    return NextResponse.json({
      fokontanyId: updatedFokontany.fokontanyId,
      nom: updatedFokontany.nom,
      codeFokontany: updatedFokontany.codeFokontany,
      createdAt: updatedFokontany.createdAt,
      totalPersonnes: updatedFokontany._count.personne,
    });
  } catch (error: unknown) {
    console.error("Error updating fokontany:", error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Fokontany not found' }, { status: 404 });
    }
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'CodeFokontany already exists' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to update fokontany' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const parsedId = parseInt(params.id, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
  
    await prisma.fokontany.delete({
      where: { fokontanyId: parsedId },
    });
    
    return NextResponse.json({ message: 'Fokontany and all associated personnes deleted successfully' }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error deleting Fokontany:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Fokontany not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete fokontany' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}