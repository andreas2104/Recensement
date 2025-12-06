/**
 * Vérifie si un email est dans la liste des admins configurés
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAIL?.split(',').map(e => e.trim().toLowerCase()) || [];
  return adminEmails.includes(email.toLowerCase());
}

/**
 * Récupère la liste de tous les emails admin configurés
 */
export function getAdminEmails(): string[] {
  return process.env.ADMIN_EMAIL?.split(',').map(e => e.trim().toLowerCase()) || [];
}

/**
 * Vérifie si c'est le premier utilisateur du système
 */
export async function isFirstUser(prisma: any): Promise<boolean> {
  const userCount = await prisma.user.count();
  return userCount === 0;
}

/**
 * Détermine le rôle d'un nouvel utilisateur
 */
export async function determineUserRole(
  email: string,
  prisma: any
): Promise<"ADMIN" | "USER"> {
  const firstUser = await isFirstUser(prisma);
  const adminEmail = isAdminEmail(email);
  
  return firstUser || adminEmail ? "ADMIN" : "USER";
}