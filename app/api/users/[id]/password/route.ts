import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { oldPassword, newPassword } = body;

    const currentUserId = req.headers.get("x-user-id");
    const currentUserRole = req.headers.get("x-user-role");

    const targetId = Number(params.id);

    // Vérifier permission
    const isSelf = Number(currentUserId) === targetId;
    const isAdmin = currentUserRole === "ADMIN";

    if (!isSelf && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You cannot change another user's password." },
        { status: 403 }
      );
    }

    // Récupération du user
    const user = await prisma.user.findUnique({
      where: { userId: targetId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Vérifier ancien mot de passe si pas admin
    if (!isAdmin) {
      const isValidOld = await bcrypt.compare(oldPassword, user.password);
      if (!isValidOld) {
        return NextResponse.json(
          { error: "Incorrect current password" },
          { status: 400 }
        );
      }
    }

    // Hash du nouveau mot de passe
    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { userId: targetId },
      data: { password: hashed },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update password", details: String(error) },
      { status: 500 }
    );
  }
}
