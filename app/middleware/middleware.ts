// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// interface JwtPayload {
//   userId: number;
//   email: string;
//   role: string;
// }

// export function middleware(req: NextRequest) {
//   const pathname = req.nextUrl.pathname;
//   console.log("🔒 Middleware executing for:", pathname);

//   // ✅ Ne pas bloquer les routes d'authentification
//   if (
//     pathname.startsWith("/api/auth/login") ||
//     pathname.startsWith("/api/auth/register")
//   ) {
//     console.log("⚪ Auth route, skipping middleware");
//     return NextResponse.next();
//   }

//   // Récupérer le token depuis les cookies
//   const token = req.cookies.get("token")?.value;
//   console.log("🍪 Token found:", token ? "Yes" : "No");

//   // Si pas de token sur une route protégée
//   if (!token) {
//     console.log("❌ No token, returning 401");
//     return NextResponse.json(
//       { error: "Unauthorized - No token" },
//       { status: 401 }
//     );
//   }

//   try {
//     // Vérifier et décoder le token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
//     console.log("✅ Token decoded:", {
//       userId: decoded.userId,
//       role: decoded.role,
//       email: decoded.email,
//     });

//     // Créer une nouvelle réponse avec les headers d'authentification
//     const requestHeaders = new Headers(req.headers);
//     requestHeaders.set("x-user-id", decoded.userId.toString());
//     requestHeaders.set("x-user-role", decoded.role);

//     console.log("✅ Added auth headers:", {
//       "x-user-id": decoded.userId,
//       "x-user-role": decoded.role,
//     });

//     // Continuer avec les headers modifiés
//     return NextResponse.next({
//       request: {
//         headers: requestHeaders,
//       },
//     });
//   } catch (error) {
//     console.error("❌ JWT verification failed:", error);

//     // Token expiré ou invalide
//     const response = NextResponse.json(
//       { error: "Unauthorized - Invalid or expired token" },
//       { status: 401 }
//     );

//     // Supprimer le cookie invalide
//     response.cookies.delete("token");

//     return response;
//   }
// }

// // Configurer les routes à protéger
// export const config = {
//   matcher: [
//     // ✅ Protéger toutes les routes API sauf login/register
//     "/api/:path*",
//     "/api/auth/me",
//     "/api/persons", // ← Pour /api/persons
//     "/api/persons/:path*", // ← Pour /api/persons/123
//     "/api/users",
//     "/api/users/:path*",
//     // Ajoutez d'autres routes API à protéger
//     // "/api/documents",
//     // "/api/documents/:path*",
//   ],
// };
