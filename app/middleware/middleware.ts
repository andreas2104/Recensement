import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // 1. Aucun token → redirect
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // 2. Vérifier le token
    interface JwtPayload {
      userId: string | number;
      role: string;
      [key: string]: unknown;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // 3. Ajouter les infos user dans les headers
    const requestHeaders = new Headers(req.headers);

    if (typeof decoded === "object" && decoded !== null) {
      requestHeaders.set("x-user-id", String(decoded.userId));
      requestHeaders.set("x-user-role", String(decoded.role));
    }

    //protected page

    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // 4. Continuer la requête
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/person/:path*"],
};
