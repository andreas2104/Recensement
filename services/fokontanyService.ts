import { Fokontany } from "@/types/fokontany";

export const  fetchFokontany = async (): Promise<Fokontany[]> => {
  try {
    const response = await fetch('/api/fokontany');
    if(!response.ok) {
      throw new Error (" Erreur lors de chargement des fokontany:")
    }
    return response.json();
  } catch (error) {
    console.error("Error lors de la recuperations des fokontany", error);
    throw error;
  }
};

export const addFokontany = async (fokontany: Fokontany): Promise<{message: string; fokontany_id: number}> => {
 try {
  const response = await fetch('/api/fokontany', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fokontany),
  });
  if (!response.ok) {
    // const errorData = await response.text();
    throw new Error ('Erreur');
  }
  return response.json();
 } catch (error) {
  console.error("erreur lors de la creation de fokontany", error);
  throw error;
 }
};

export const updateFokontany = async (fokontany: Fokontany): Promise<Fokontany> => {
  try {
    const response = await fetch(`/api/fokontany/${fokontany.fokontanyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fokontany),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update fokontany');
    }
    const updatedFokontany = await response.json();
    return updatedFokontany;

  } catch (error) {
    console.error("Error updating fokontany:", error);
    throw error;
  }
};

export const deleteFokontany = async (fokontanyId: number): Promise<void> => {
  try {
    const response = await fetch(`/api/fokontany/${fokontanyId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete personne');
    }
    console.log(`Personne with ID ${fokontanyId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting personne:", error);
    throw error;
  }
};

export const getFokontanyById = async (fokontanyId: number): Promise<Fokontany> => {
  try {
    const response = await fetch(`/api/fokontany/${fokontanyId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur lors de la récupération du fokontany.");
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération du fokontany:", error);
    throw error;
  }
};
