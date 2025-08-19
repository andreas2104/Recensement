import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try{
  const data = await prisma.user.findMany({
    include: {
      city: {
        select: {
          city: true
        }
      }
    }
  });

  const formattedData = data.map(data=> ({
    userId: data.userId,
    name: data.name,
    firstname: data.firstname,
    email: data.email,
    contact: data.contact,
    password: data.password,
    city: data.city.city,
    role: data.role
    
  }));
  return NextResponse.json(formattedData);
}catch (error) {
  console.error("Error fetching users:", error);
  return NextResponse.json(
    { error: "Failed to fetch users data"},
    {status: 500}
  );
}
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
          name,
          firstname,
          email,
          contact,
          centerId,
          password,
          role,
        } = body;
          const parsedCenterId = parseInt(centerId,10);
      if ( isNaN(parsedCenterId))
      {
        return NextResponse.json(
          {error:"Invalid numerical input for ID.ensure it's a numbers."},
          {status: 400}
        );
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          firstname,
          contact,email,
          password, 
          centerId:parsedCenterId,
          role 
        },
      });
      return NextResponse.json(newUser, {status: 201});
      } catch (error) {
        console.error("Erreur POST user:", error);
        return NextResponse.json(
          {error: "Error during creation user"},
          {status: 500}
        );
      }
  }
