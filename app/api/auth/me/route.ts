import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { string } from "zod";

export async function GET(req: NextRequest) {
  try {
    const currentUserId = req.headers.get("x-user-id");

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { userId: Number(currentUserId) },
      select: {
        userId: true,
        name: true,
        email: true,
        role: true,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed  to get  current user " },
      { status: 500 }
    );
  }
}
