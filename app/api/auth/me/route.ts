import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export async function GET(req: NextRequest) {
  try {
    // Récupérer le token depuis les cookies
    const token = req.cookies.get("token")?.value;
    console.log("🍪 Token from cookies:", token ? "Present" : "Missing");

    if (!token) {
      console.log("❌ No token found");
      return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
    }

    // Vérifier et décoder le token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      console.log("✅ Token decoded successfully:", decoded);
    } catch (jwtError) {
      console.error("❌ JWT verification failed:", jwtError);
      return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
    }

    // Récupérer l'utilisateur depuis la DB
    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
      select: {
        userId: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      console.log("❌ User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("✅ Current user fetched:", user);
    return NextResponse.json(user);
  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json(
      { error: "Failed to get current user" },
      { status: 500 }
    );
  }
}