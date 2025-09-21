import { Personne } from "@/types/personne";

// Récupérer toutes les personnes
export const fetchPersonnes = async (): Promise<Personne[]> => {
  try {
    const response = await fetch("/api/personne");
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des personnes");
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des personnes:", error);
    throw error;
  }
};

// Ajouter une personne
export const addPersonne = async (
  personne: Omit<Personne, "personneId" | "createdAt">
): Promise<Personne> => {
  try {
    const response = await fetch("/api/personne", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(personne),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur lors de la création de la personne");
    }

    return response.json();
  } catch (error) {
    console.error("Erreur lors de la création de la personne:", error);
    throw error;
  }
};

// Mettre à jour une personne
export const updatePersonne = async (personne: Personne): Promise<Personne> => {
  try {
    const response = await fetch(`/api/personne/${personne.personneId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(personne),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur lors de la mise à jour de la personne");
    }

    return response.json();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la personne:", error);
    throw error;
  }
};

// Supprimer une personne
export const deletePersonne = async (personneId: number): Promise<void> => {
  try {
    const response = await fetch(`/api/personne/${personneId}`, { method: "DELETE" });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur lors de la suppression de la personne");
    }

    console.log(`Personne avec ID ${personneId} supprimée avec succès`);
  } catch (error) {
    console.error("Erreur lors de la suppression de la personne:", error);
    throw error;
  }
};

// Récupérer une personne par ID
export const getPersonneById = async (personneId: number): Promise<Personne> => {
  try {
    const response = await fetch(`/api/personne/${personneId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur lors de la récupération de la personne");
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération de la personne:", error);
    throw error;
  }
};
