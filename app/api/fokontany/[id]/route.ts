import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();


interface Params {
  id: string;
}

export async function GET(
  _request: NextRequest, 
  { params }: { params: Params }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "Fokontany ID is required" }, { status: 400 });
    }

    const fokontany = await prisma.fokontany.findUnique({
      where: {
        fokontanyId: Number(id),
      },
    });

    if (!fokontany) {
      return NextResponse.json({ error: "Fokontany not found" }, { status: 404 });
    }

    return NextResponse.json(fokontany);
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
    const id = params.id;
    const body = await request.json();
    const { nom, codeFokontany } = body;

    if (!id) {
      return NextResponse.json({ error: "Fokontany ID is required" }, { status: 400 });
    }

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const updatedFokontany = await prisma.fokontany.update({
      where: {
        fokontanyId: parsedId,
      },
      data: {
        nom,
        codeFokontany,
      },
    });

    return NextResponse.json(updatedFokontany);
  } catch (error: unknown) {
   
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: "Fokontany not found" }, { status: 404 });
    }
    console.error("Error updating fokontany:", error);
    return NextResponse.json({ error: "Failed to update fokontany" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  _request: NextRequest, 
  { params }: { params: Params }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "Fokontany ID is required" }, { status: 400 });
    }

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    await prisma.fokontany.delete({
      where: {
        fokontanyId: parsedId,
      },
    });

    return NextResponse.json({ message: "Fokontany deleted successfully" });
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: "Fokontany not found" }, { status: 404 });
    }
    console.error("Error deleting fokontany:", error);
    return NextResponse.json({ error: "Failed to delete fokontany" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}