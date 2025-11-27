import { SignupFormSchema } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = SignupFormSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          errors: parsed.error.flatten().fieldErrors,
        },
        {status: 400}
      );
    }
    
    const {name, email, password, phone} = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: {email},
    });

    if (existingUser) {
      return Response.json(
        {message: "Email already exist"},
        {status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
      },
    });

    return Response.json(
      {message: 'Account created successfully'},
      { status: 201}
    );
  } catch {
    return Response.json(
      {message: "Server Error"}
    );
  }
}