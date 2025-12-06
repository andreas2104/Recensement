"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
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

/* ==================== FETCH ALL PERSONS ==================== */
const fetchPersons = async (): Promise<Person[]> => {
  console.log("🔍 Fetching all persons...");

  const response = await fetch("/api/persons", {
    method: "GET",
    // credentials: "include",
  });

  console.log("📡 GET /api/persons - Status:", response.status);

  if (!response.ok) {
    const error = await response.json();
    console.error("❌ Error fetching persons:", error);
    throw new Error(error.error || error.message || "Error fetching persons");
  }

  const result = await response.json();
  console.log(`✅ Fetched ${result} persons`);
  return result;
};

export const usePersons = () => {
  return useQuery({
    queryKey: ["persons"],
    queryFn: fetchPersons,
    staleTime: 30 * 1000,
  });
};

/* ==================== FETCH SINGLE PERSON ==================== */
const fetchPerson = async (id: string): Promise<Person> => {
  console.log("🔍 Fetching person:", id);

  const response = await fetch(`/api/persons/${id}`, {
    method: "GET",
    // credentials: "include",
  });

  console.log("📡 GET /api/persons/[id] - Status:", response.status);

  if (!response.ok) {
    const error = await response.json();
    console.error(" Error fetching person:", error);
    throw new Error(error.error || "Erreur lors de la récupération");
  }

  const result = await response.json();
  console.log(" Person fetched:", result);
  return result;
};

export const usePerson = (id: string) => {
  return useQuery({
    queryKey: ["persons", id],
    queryFn: () => fetchPerson(id),
    enabled: !!id,
  });
};

/* ==================== CREATE PERSON ==================== */
const createPerson = async (data: PersonneFormData) => {
  console.log("Creating person:", data);

  const response = await fetch("/api/persons", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // credentials: "include",
    body: JSON.stringify(data),
  });

  console.log("POST /api/persons - Status:", response.status);

  const result = await response.json();
  console.log(" Response:", result);

  if (!response.ok) {
    console.error(" Error creating person:", result);
    throw new Error(
      result.error || result.message || "Erreur lors de la création"
    );
  }

  return result;
};

export const useCreatePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPerson,
    onSuccess: (data) => {
      console.log("Person created successfully");
      toast.success(data.message || "Personne créée avec succès");
      queryClient.invalidateQueries({ queryKey: ["persons"] });
      // queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      console.error("create person error:", error);
      toast.error(error.message || "Échec de la création");
    },
  });
};

/* ==================== UPDATE PERSON ==================== */
const updatePerson = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<PersonneFormData>;
}) => {
  console.log("✏️ Updating person:", id, data);

  const response = await fetch(`/api/persons/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  console.log("📡 PATCH /api/persons/[id] - Status:", response.status);

  const result = await response.json();

  if (!response.ok) {
    console.error("❌ Error updating person:", result);
    throw new Error(result.error || "Erreur lors de la mise à jour");
  }

  console.log("✅ Person updated:", result);
  return result;
};

export const useUpdatePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePerson,
    onSuccess: (data, variables) => {
      console.log("✅ Update successful");
      toast.success("Personne mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["persons"] });
      queryClient.invalidateQueries({ queryKey: ["persons", variables.id] });
    },
    onError: (error: Error) => {
      console.error("❌ Update error:", error);
      toast.error(error.message || "Échec de la mise à jour");
    },
  });
};

/* ==================== DELETE PERSON ==================== */
const deletePerson = async (id: string) => {
  console.log("🗑️ Deleting person:", id);

  const response = await fetch(`/api/persons/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  console.log("📡 DELETE /api/persons/[id] - Status:", response.status);

  const result = await response.json();

  if (!response.ok) {
    console.error("❌ Error deleting person:", result);
    throw new Error(result.error || "Erreur lors de la suppression");
  }

  console.log("✅ Person deleted");
  return result;
};

export const useDeletePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePerson,
    onSuccess: () => {
      console.log("✅ Delete successful");
      toast.success("Personne supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ["persons"] });
    },
    onError: (error: Error) => {
      console.error("❌ Delete error:", error);
      toast.error(error.message || "Échec de la suppression");
    },
  });
};
