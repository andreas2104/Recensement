import * as Z from "zod";

export const SignupFormSchema = Z.object({
  name: Z.string()
    .min(2, { message: "Name must contain at least 2 characters." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .trim(),

  email: Z.string()
    .email({ message: "Invalid email address." })
    .trim(),

  phone: Z.string()
    .min(8, { message: "Phone number must contain at least 8 characters." })
    .trim(),

  password: Z.string()
    .min(8, {
      message: "Password must contain at least 8 characters.",
    })
    .regex(/[a-zA-Z]/, {
      message: "Password must contain at least one letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one digit.",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .trim(),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        phone?: string[];
      };
      message?: string;
    }
  | undefined;
