// app/api/person/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const role = req.headers.get("x-user-role");

    if (!userId || !role) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let persons;

    // ADMIN peut tout voir
    if (role === "ADMIN") {
      persons = await prisma.person.findMany({
        orderBy: { personId: "asc" },
      });
    } else {
      // USER → peut voir seulement ses propres données
      persons = await prisma.person.findMany({
        where: { personId: Number(userId) },
      });
    }

    return NextResponse.json(persons);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch persons", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");

    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const requiredFields = [
      "firstName", "lastName", "gender", "birthDate",
      "birthPlace", "nationalId", "issueDate",
      "issuePlace", "profession", "currentAddress",
      "previousAddress", "nationality", "phone",
    ];

    const missing = requiredFields.filter((f) => !body[f]);

    if (missing.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: missing.join(", ")
        },
        { status: 400 }
      );
    }

    if (
      isNaN(Date.parse(body.birthDate)) ||
      isNaN(Date.parse(body.issueDate))
    ) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const exists = await prisma.person.findUnique({
      where: { nationalId: body.nationalId },
    });

    if (exists) {
      return NextResponse.json(
        { error: "National ID already exists" },
        { status: 409 }
      );
    }

    const newPerson = await prisma.person.create({
      data: { ...body },
    });

    return NextResponse.json(
      { message: "Person created", data: newPerson },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to create person", details: e.message },
      { status: 500 }
    );
  }
}
