"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export interface Tax {
  taxId: number;
  personId: number;
  year: number;
  amount: number;
  paidAmount: number;
  isPaid: boolean;
  paidAt: string | null;
  dueDate: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  person?: {
    personId: number;
    firstName: string;
    lastName: string;
  };
}

export interface TaxFormData {
  personId: number;
  year: number;
  amount: number;
  paidAmount?: number;
  isPaid?: boolean;
  paidAt?: string;
  dueDate?: string;
  description?: string;
}

export interface TaxStats {
  totalTaxes: number;
  totalAmount: number;
  totalPaid: number;
  totalUnpaid: number;
  paidCount: number;
  unpaidCount: number;
  byYear: {
    year: number;
    total: number;
    paid: number;
    unpaid: number;
    count: number;
  }[];
}

/* ==================== FETCH ALL TAXES ==================== */
const fetchTaxes = async (): Promise<Tax[]> => {
  console.log("🔍 Fetching all taxes...");

  const response = await fetch("/api/taxes", {
    method: "GET",
  });

  console.log("📡 GET /api/taxes - Status:", response.status);

  if (!response.ok) {
    const error = await response.json();
    console.error("❌ Error fetching taxes:", error);
    throw new Error(error.error || error.message || "Error fetching taxes");
  }

  const result = await response.json();
  console.log(`✅ Fetched ${result.length} taxes`);
  return result;
};

export const useTaxes = () => {
  return useQuery({
    queryKey: ["taxes"],
    queryFn: fetchTaxes,
    staleTime: 30 * 1000,
  });
};

/* ==================== FETCH TAX STATS ==================== */
const fetchTaxStats = async (): Promise<TaxStats> => {
  console.log("🔍 Fetching tax stats...");

  const response = await fetch("/api/taxes/stats", {
    method: "GET",
  });

  console.log("📡 GET /api/taxes/stats - Status:", response.status);

  if (!response.ok) {
    const error = await response.json();
    console.error("❌ Error fetching tax stats:", error);
    throw new Error(error.error || error.message || "Error fetching tax stats");
  }

  const result = await response.json();
  console.log("✅ Tax stats fetched:", result);
  return result;
};

export const useTaxStats = () => {
  return useQuery({
    queryKey: ["tax-stats"],
    queryFn: fetchTaxStats,
    staleTime: 30 * 1000,
  });
};

/* ==================== FETCH TAXES BY PERSON ==================== */
const fetchTaxesByPerson = async (personId: number): Promise<Tax[]> => {
  console.log("🔍 Fetching taxes for person:", personId);

  const response = await fetch(`/api/taxes?personId=${personId}`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error fetching person taxes");
  }

  return response.json();
};

export const useTaxesByPerson = (personId: number) => {
  return useQuery({
    queryKey: ["taxes", "person", personId],
    queryFn: () => fetchTaxesByPerson(personId),
    enabled: !!personId,
  });
};

/* ==================== FETCH TAXES BY YEAR ==================== */
const fetchTaxesByYear = async (year: number): Promise<Tax[]> => {
  console.log("🔍 Fetching taxes for year:", year);

  const response = await fetch(`/api/taxes?year=${year}`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error fetching yearly taxes");
  }

  return response.json();
};

export const useTaxesByYear = (year: number) => {
  return useQuery({
    queryKey: ["taxes", "year", year],
    queryFn: () => fetchTaxesByYear(year),
    enabled: !!year,
  });
};

/* ==================== CREATE TAX ==================== */
const createTax = async (data: TaxFormData) => {
  console.log("➕ Creating tax:", data);

  const response = await fetch("/api/taxes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Erreur lors de la création");
  }

  return result;
};

export const useCreateTax = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTax,
    onSuccess: (data) => {
      toast.success("Taxe créée avec succès");
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
      queryClient.invalidateQueries({ queryKey: ["tax-stats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la création");
    },
  });
};

/* ==================== UPDATE TAX ==================== */
const updateTax = async ({
  taxId,
  data,
}: {
  taxId: number;
  data: Partial<TaxFormData>;
}) => {
  console.log("📝 Updating tax:", taxId, data);

  const response = await fetch(`/api/taxes/${taxId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Erreur lors de la mise à jour");
  }

  return result;
};

export const useUpdateTax = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTax,
    onSuccess: () => {
      toast.success("Taxe mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
      queryClient.invalidateQueries({ queryKey: ["tax-stats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la mise à jour");
    },
  });
};

/* ==================== MARK TAX AS PAID ==================== */
const markTaxAsPaid = async ({
  taxId,
  paidAmount,
}: {
  taxId: number;
  paidAmount: number;
}) => {
  console.log("💰 Marking tax as paid:", taxId);

  const response = await fetch(`/api/taxes/${taxId}/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paidAmount }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Erreur lors du paiement");
  }

  return result;
};

export const useMarkTaxAsPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markTaxAsPaid,
    onSuccess: () => {
      toast.success("Paiement enregistré avec succès");
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
      queryClient.invalidateQueries({ queryKey: ["tax-stats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec du paiement");
    },
  });
};

/* ==================== DELETE TAX ==================== */
const deleteTax = async (taxId: number) => {
  console.log("🗑️ Deleting tax:", taxId);

  const response = await fetch(`/api/taxes/${taxId}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Erreur lors de la suppression");
  }

  return result;
};

export const useDeleteTax = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTax,
    onSuccess: () => {
      toast.success("Taxe supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
      queryClient.invalidateQueries({ queryKey: ["tax-stats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la suppression");
    },
  });
};

/* ==================== FETCH TAX BY ID ==================== */
export const useTax = (id: string | number) => {
  return useQuery<Tax | null, Error>({
    queryKey: ["tax", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/taxes/${id}`);
      if (!res.ok) throw new Error("Erreur lors du chargement de la taxe");
      return res.json();
    },
    enabled: !!id,
  });
};
