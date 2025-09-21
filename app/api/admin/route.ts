import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET : liste des admins
export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        adminId: true,
        nom: true,
        email: true,
        contact: true,
        createdAt: true,
      },
    });

    return NextResponse.json(admins, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des admins:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les admins" },
      { status: 500 }
    );
  }
}

// POST : créer un nouvel admin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, password, email, contact } = body;

    if (!nom || !password || !email || !contact) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }

    const newAdmin = await prisma.admin.create({
      data: {
        nom,
        password, // ⚠️ tu devrais le hasher avec bcrypt
        email,
        contact,
      },
    });

    return NextResponse.json(newAdmin, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création d’un admin:", error);
    return NextResponse.json(
      { error: "Erreur pendant la création de l’admin" },
      { status: 500 }
    );
  }
}
