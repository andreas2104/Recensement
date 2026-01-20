import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get single tax
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taxId = parseInt(id);

    const tax = await prisma.tax.findUnique({
      where: { taxId },
      include: {
        person: {
          select: {
            personId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!tax) {
      return NextResponse.json(
        { error: "Taxe non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(tax);
  } catch (error) {
    console.error("Error fetching tax:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la taxe" },
      { status: 500 }
    );
  }
}

// PATCH - Update tax
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taxId = parseInt(id);
    const body = await request.json();

    const { amount, paidAmount, isPaid, paidAt, dueDate, description } = body;

    const updateData: any = {};

    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (paidAmount !== undefined) updateData.paidAmount = parseFloat(paidAmount);
    if (isPaid !== undefined) updateData.isPaid = isPaid;
    if (paidAt !== undefined) updateData.paidAt = paidAt ? new Date(paidAt) : null;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (description !== undefined) updateData.description = description;

    const tax = await prisma.tax.update({
      where: { taxId },
      data: updateData,
      include: {
        person: {
          select: {
            personId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(tax);
  } catch (error: any) {
    console.error("Error updating tax:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Taxe non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la taxe" },
      { status: 500 }
    );
  }
}

// DELETE - Delete tax
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taxId = parseInt(id);

    await prisma.tax.delete({
      where: { taxId },
    });

    return NextResponse.json({ message: "Taxe supprimée avec succès" });
  } catch (error: any) {
    console.error("Error deleting tax:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Taxe non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la suppression de la taxe" },
      { status: 500 }
    );
  }
}
