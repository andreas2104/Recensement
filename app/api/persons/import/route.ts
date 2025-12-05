import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parse } from "csv-parse/sync";

const handleError = (error: any, message: string, status: number = 500) => {
  console.error("API Error:", error);
  return NextResponse.json(
    { error: message, details: error.message },
    { status }
  );
};

export async function POST(req: NextRequest) {
  try {
    const currentUserId = req.headers.get("x-user-id");
    const currentUserRole = req.headers.get("x-user-role");

    if (!currentUserId || !currentUserRole) {
      return NextResponse.json(
        { error: "Unauthorized: missing headers" },
        { status: 401 }
      );
    }

    // 🔐 Seul l'ADMIN peut importer
    if (currentUserRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Only ADMIN can import persons" },
        { status: 403 }
      );
    }

    // Récupération du fichier
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Vérification du type de fichier
    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "File must be a CSV" },
        { status: 400 }
      );
    }

    // Lecture du fichier
    const fileContent = await file.text();

    // Parser le CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (records.length === 0) {
      return NextResponse.json({ error: "CSV file is empty" }, { status: 400 });
    }

    // Valider les en-têtes CSV attendus
    const expectedHeaders = [
      "firstName",
      "lastName",
      "gender",
      "birthDate",
      "birthPlace",
      "nationalId",
      "issueDate",
      "issuePlace",
      "profession",
      "fatherName",
      "motherName",
      "currentAddress",
      "previousAddress",
      "nationality",
      "phone",
      "maritalStatus",
      "status",
      "isVoter",
    ];

    const actualHeaders = Object.keys(records[0]);
    const missingHeaders = expectedHeaders.filter(
      (h) => !actualHeaders.includes(h)
    );

    if (missingHeaders.length > 0) {
      return NextResponse.json(
        {
          error: "Invalid CSV format",
          details: `Missing headers: ${missingHeaders.join(", ")}`,
          expectedHeaders,
          actualHeaders,
        },
        { status: 400 }
      );
    }

    const results = {
      total: records.length,
      success: 0,
      failed: 0,
      errors: [] as Array<{ row: number; error: string }>,
      created: [] as any[],
    };

    // Traitement ligne par ligne
    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNumber = i + 2; // +2 car ligne 1 = headers, index commence à 0

      try {
        // Validation des champs obligatoires
        const requiredFields = [
          "firstName",
          "lastName",
          "gender",
          "birthDate",
          "birthPlace",
          "nationalId",
          "issueDate",
          "issuePlace",
          "profession",
          "currentAddress",
          "previousAddress",
          "nationality",
          "phone",
        ];

        const missingFields = requiredFields.filter((field) => !row[field]);
        if (missingFields.length > 0) {
          throw new Error(
            `Missing required fields: ${missingFields.join(", ")}`
          );
        }

        // Validation des dates
        if (
          isNaN(Date.parse(row.birthDate)) ||
          isNaN(Date.parse(row.issueDate))
        ) {
          throw new Error("Invalid date format for birthDate or issueDate");
        }

        // Validation du genre
        if (
          !["M", "F", "Male", "Female", "Homme", "Femme"].includes(row.gender)
        ) {
          throw new Error("Gender must be M/F/Male/Female/Homme/Femme");
        }

        // Normaliser le genre
        const normalizedGender = ["M", "Male", "Homme"].includes(row.gender)
          ? "M"
          : "F";

        // Validation du statut marital
        const validMaritalStatus = ["CELIBATAIRE", "DIVORCE", "VEUF", "MARIE"];
        let maritalStatus = row.maritalStatus || "CELIBATAIRE";
        if (!validMaritalStatus.includes(maritalStatus.toUpperCase())) {
          maritalStatus = "CELIBATAIRE";
        }

        // Validation du statut
        const validStatus = ["ACTIF", "DEMENAGER", "DECEDE"];
        let status = row.status || "ACTIF";
        if (!validStatus.includes(status.toUpperCase())) {
          status = "ACTIF";
        }

        // Vérifier si la personne existe déjà
        const existingPerson = await prisma.person.findUnique({
          where: { nationalId: row.nationalId },
        });

        if (existingPerson) {
          throw new Error(
            `Person with nationalId ${row.nationalId} already exists`
          );
        }

        // Créer la personne
        const newPerson = await prisma.person.create({
          data: {
            firstName: row.firstName,
            lastName: row.lastName,
            gender: normalizedGender,
            birthDate: new Date(row.birthDate),
            birthPlace: row.birthPlace,
            nationalId: row.nationalId,
            issuedDate: new Date(row.issueDate),
            issuedPlace: row.issuePlace,
            profession: row.profession,
            fatherName: row.fatherName || null,
            motherName: row.motherName || null,
            currentAddress: row.currentAddress,
            previousAddress: row.previousAddress,
            nationality: row.nationality,
            phone: row.phone,
            maritalStatus: maritalStatus.toUpperCase() as any,
            status: status.toUpperCase() as any,
            isVoter:
              row.isVoter?.toLowerCase() === "true" ||
              row.isVoter === "1" ||
              false,
          },
        });

        results.success++;
        results.created.push({
          id: newPerson.personId,
          nationalId: newPerson.nationalId,
          name: `${newPerson.firstName} ${newPerson.lastName}`,
        });
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          row: rowNumber,
          error: error.message,
          data: row,
        });
      }
    }

    // Réponse finale
    return NextResponse.json(
      {
        message: "Import completed",
        summary: results,
        details:
          results.errors.length > 0
            ? {
                errors: results.errors,
              }
            : undefined,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return handleError(error, "Failed to import CSV");
  }
}
