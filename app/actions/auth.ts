"use server";

import { SignupFormSchema } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function signup(state: unknown, formData: FormData) {

  const validated = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, password } = validated.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
    },
  });

  return { message: "Account created" };
}
