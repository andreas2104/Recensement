import { Admin } from "@/types/admin";

/**
 * Récupérer tous les admins (normalement 1 seul dans ton cas local)
 */
export const fetchAdmins = async (): Promise<Admin[]> => {
  try {
    const response = await fetch("/api/admin");
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des admins");
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des admins:", error);
    throw error;
  }
};

/**
 * Ajouter un admin
 */
export const addAdmin = async (
  admin: Admin
): Promise<{ message: string; adminId: number }> => {
  try {
    const response = await fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(admin),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la création de l'admin");
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la création de l'admin:", error);
    throw error;
  }
};

/**
 * Mettre à jour un admin
 */
export const updateAdmin = async (admin: Admin): Promise<Admin> => {
  try {
    const response = await fetch(`/api/admin/${admin.adminId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom: admin.nom,
        email: admin.email,
        contact: admin.contact,
        password: admin.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Échec de la mise à jour de l'admin");
    }

    return response.json();
  } catch (error) {
    console.error("Erreur mise à jour admin:", error);
    throw error;
  }
};

/**
 * Supprimer un admin (rarement utilisé dans ton cas)
 */
export const deleteAdmin = async (adminId: number): Promise<void> => {
  if (!adminId || isNaN(adminId)) {
    throw new Error("ID Admin invalide ou manquant");
  }

  try {
    const response = await fetch(`/api/admin/${adminId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Échec de la suppression de l'admin");
    }
    console.log(`Admin avec ID ${adminId} supprimé avec succès.`);
  } catch (error) {
    console.error("Erreur suppression admin:", error);
    throw error;
  }
};

/**
 * Récupérer un admin par ID
 */
export const getAdminById = async (adminId: number): Promise<Admin> => {
  try {
    const response = await fetch(`/api/admin/${adminId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Erreur lors de la récupération de l'admin."
      );
    }
    return response.json();
  } catch (error) {
    console.error("Erreur récupération admin:", error);
    throw error;
  }
};
