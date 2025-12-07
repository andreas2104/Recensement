import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const dateLimiteParam = searchParams.get('dateLimite');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;
    
    let dateLimite = new Date();
    if (dateLimiteParam) {
      dateLimite = new Date(dateLimiteParam);
      if (isNaN(dateLimite.getTime())) {
        return NextResponse.json(
          { error: 'Format de date invalide' },
          { status: 400 }
        );
      }
    }
    
    const [electeurs, total] = await Promise.all([
      prisma.person.findMany({
        where: {
          isVoter: true,
          status: Status.ACTIF,
          createdAt: { lte: dateLimite } 
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.person.count({
        where: {
          isVoter: true,
          status: Status.ACTIF,
          createdAt: { lte: dateLimite }
        }
      })
    ]);
    
    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      dateLimite: dateLimite.toISOString().split('T')[0],
      data: electeurs
    });
    
  } catch (error) {
    console.error(" Error in GET /api/isvoter-actifs:", error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}