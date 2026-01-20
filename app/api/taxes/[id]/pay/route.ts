import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

// POST - Mark tax as paid (fully or partially)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taxId = parseInt(id);
    const body = await request.json();
    const { paidAmount } = body;

    // Get current tax
    const currentTax = await prisma.tax.findUnique({
      where: { taxId },
    });

    if (!currentTax) {
      return NextResponse.json(
        { error: "Taxe non trouvée" },
        { status: 404 }
      );
    }

    const newPaidAmount = currentTax.paidAmount + (paidAmount || currentTax.amount - currentTax.paidAmount);
    const isPaid = newPaidAmount >= currentTax.amount;

    const tax = await prisma.tax.update({
      where: { taxId },
      data: {
        paidAmount: newPaidAmount,
        isPaid,
        paidAt: isPaid ? new Date() : currentTax.paidAt,
      },
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
    console.error("Error paying tax:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Taxe non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors du paiement de la taxe" },
      { status: 500 }
    );
  }
}
