import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// Extend the session user type
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userId?: string;
      role?: string;
    };
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials!.email },
        });

        if (!user) return null;

        const match = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!match) return null;

        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        if (!session.user) {
          session.user = {};
        }
        session.user.userId = token.userId;
        session.user.role = token.role;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
