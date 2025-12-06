import { SignupFormSchema } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { determineUserRole, isFirstUser } from "@/lib/adminUtils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validation avec Zod
    const parsed = SignupFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = parsed.data;

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email already exists",
          errors: {
            email: ["This email is already registered"],
          },
        },
        { status: 400 }
      );
    }

    // ✅ Déterminer le rôle (premier user OU email admin)
    const isFirst = await isFirstUser(prisma);
    const role = await determineUserRole(email, prisma);

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec le rôle approprié
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
        role, // ✅ Rôle automatiquement attribué
      },
      select: {
        userId: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // ✅ Générer automatiquement le JWT pour auto-login
    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Message personnalisé selon le type de compte
    let message = "Account created successfully";
    if (isFirst) {
      message = "🎉 First user created as ADMIN! Welcome to the system.";
    } else if (role === "ADMIN") {
      message = "✅ Admin account created successfully!";
    }

    // Créer la réponse
    const response = NextResponse.json(
      {
        message,
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        isFirstUser: isFirst,
      },
      { status: 201 }
    );

    // ✅ Définir le cookie JWT pour auto-login
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
