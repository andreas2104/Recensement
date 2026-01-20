import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

// GET - List all taxes with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const personId = searchParams.get("personId");
    const year = searchParams.get("year");
    const isPaid = searchParams.get("isPaid");

    const where: any = {};

    if (personId) {
      where.personId = parseInt(personId);
    }

    if (year) {
      where.year = parseInt(year);
    }

    if (isPaid !== null && isPaid !== undefined) {
      where.isPaid = isPaid === "true";
    }

    const taxes = await prisma.tax.findMany({
      where,
      include: {
        person: {
          select: {
            personId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(taxes);
  } catch (error) {
    console.error("Error fetching taxes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des taxes" },
      { status: 500 }
    );
  }
}

// POST - Create a new tax
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { personId, year, amount, paidAmount, isPaid, paidAt, dueDate, description } = body;

    // Validate required fields
    if (!personId || !year || amount === undefined) {
      return NextResponse.json(
        { error: "personId, year et amount sont requis" },
        { status: 400 }
      );
    }

    // Check if person exists
    const person = await prisma.person.findUnique({
      where: { personId: parseInt(personId) },
    });

    if (!person) {
      return NextResponse.json(
        { error: "Personne non trouvée" },
        { status: 404 }
      );
    }

    // Create tax
    const tax = await prisma.tax.create({
      data: {
        personId: parseInt(personId),
        year: parseInt(year),
        amount: parseFloat(amount),
        paidAmount: paidAmount ? parseFloat(paidAmount) : 0,
        isPaid: isPaid || false,
        paidAt: paidAt ? new Date(paidAt) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        description: description || null,
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

    return NextResponse.json(tax, { status: 201 });
  } catch (error: any) {
    console.error("Error creating tax:", error);
    
    // Handle unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Cette taxe existe déjà pour cette personne et cette année" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la création de la taxe" },
      { status: 500 }
    );
  }
}
