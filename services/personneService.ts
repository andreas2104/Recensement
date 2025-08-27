import { Personne } from "@/types/personne";

export const  fetchPersonnes = async (): Promise<Personne[]> => {
  try {
    const response = await fetch('/api/personne');
    if(!response.ok) {
      throw new Error (" Erreur lors de chargement des personnes:")
    }
    return response.json();
  } catch (error) {
    console.error("Error lors de la recuperations des personne", error);
    throw error;
  }
};

export const addPersonne = async (personne: Personne): Promise<{message: string; personne_id: number}> => {
 try {
  const response = await fetch('/api/personne', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(personne),
  });
  if (!response.ok) {
    throw new Error ('Erreur');
  }
  return response.json();
 } catch (error) {
  console.error("erreur lors de la creation de personne", error);
  throw error;
 }
};

export const updatePersonne = async (personne: Personne): Promise<Personne> => {
  try {
    const response = await fetch(`/api/personne/${personne.personneId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(personne),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update personne');
    }
    const updatedPersonne = await response.json();
    return updatedPersonne;

  } catch (error) {
    console.error("Error updating personne:", error);
    throw error;
  }
};

export const deletePersonne = async (personneId: number): Promise<void> => {
  try {
    const response = await fetch(`/api/personne/${personneId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete personne');
    }
    console.log(`Personne with ID ${personneId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting personne:", error);
    throw error;
  }
};

export const getPersonneById = async (personneId: number): Promise<Personne> => {
  try {
    const response = await fetch(`/api/personne/${personneId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur lors de la récupération du fokontany.");
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération du personne:", error);
    throw error;
  }
};

export const getPersonneByFokontany = async (fokontanyId: number): Promise<Personne[]> => {
  try {
    const response = await fetch(`/api/personne/fokontany/${fokontanyId}`, {
      method: 'GET',
    });
    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 404 && errorData.error === "Fokontany n'existe pas") {
        throw new Error("Le fokontany demandé n'existe pas.");
      }
      throw new Error(errorData.error || 'Erreur lors de la récupération des personnes par fokontany');
    }
    return response.json();
  } catch (error) {
    console.error('Erreur récupération personnes par fokontany:', error);
    throw error;
  }
};
