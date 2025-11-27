import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "wrong Email or password " },
        { status: 400 }
      );
    }

    const isMatching = await bcrypt.compare(password, user.password);

    if (!isMatching) {
      return NextResponse.json(
        { message: "Wrong email or password " },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      { message: "connexion successfully" },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Errer server" }, { status: 500 });
  }
}
