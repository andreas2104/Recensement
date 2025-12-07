import { jwtDecode } from "jwt-decode";

/* -----fafaina rehefa mety tsara ny usecurrentuser------------------------ GET COOKIE ----------------------------- */
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

/* ----------------------------- TYPE DU JWT ----------------------------- */
export interface CustomJwtPayload {
  userId?: string;
  sub?: string;
  role?: string;
  email?: string;
  exp?: number;
  [key: string]: any;
}

/* --------------------------- DECODE JWT --------------------------- */
const decodeJWT = (token: string): CustomJwtPayload | null => {
  try {
    return jwtDecode<CustomJwtPayload>(token);
  } catch (error) {
    console.error("JWT decoding failed:", error);
    return null;
  }
};

/* --------------------------- HOOK USEAUTH ----
verifi if personne is user or a admin---------------------- */
export const useAuth = () => {
  const token = getCookie("token");
  const decoded = token ? decodeJWT(token) : null;

  return {
    token,
    authInfo: decoded
      ? {
          userId: decoded?.userId || decoded?.sub,
          userRole: decoded?.role,
          email: decoded?.email,
          exp: decoded?.exp,
        }
      : null,
    isAuthenticated: !!token,
  };
};
