import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useAuth } from "./useAuth";
import { Person } from "@prisma/client";

export interface PersonneFormData {
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  birthPlace: string;
  nationalId: string;
  issueDate: string;
  issuePlace: string;
  profession: string;
  fatherName?: string;
  motherName?: string;
  currentAddress: string;
  previousAddress: string;
  nationality: string;
  phone: string;
  maritalStatus?: string;
  status?: string;
  isVoter?: boolean;
}

/* --------------------------- CREATE PERSON API -------------------------- */
const createPerson = async (data: PersonneFormData, token: string) => {
  const response = await fetch("/api/persons", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok)
    throw new Error(result.message || "Erreur lors de la création");

  return result;
};

/* --------------------------- REACT QUERY HOOK --------------------------- */
export const useCreatePerson = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (data: PersonneFormData) => {
      if (!token) throw new Error("Utilisateur non authentifié");
      return createPerson(data, token);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Personne créée avec succès");

      // ⚡ IMPORTANT : invalider la bonne clé
      queryClient.invalidateQueries({ queryKey: ["persons"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Échec de la création");
    },
  });
};
