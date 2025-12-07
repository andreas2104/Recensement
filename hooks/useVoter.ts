"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Person, Status } from "@prisma/client";

export interface ElecteursActifsParams {
  page?: number;
  limit?: number;
  dateLimite?: string;
}

export interface ElecteursActifsResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  dateLimite: string;
  data: Person[];
}


const fetchElecteursActifs = async (params: ElecteursActifsParams = {}): Promise<ElecteursActifsResponse> => {
  const { page = 1, limit = 50, dateLimite } = params;
  
  // Construction des paramètres de requête
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (dateLimite) {
    queryParams.append('dateLimite', dateLimite);
  }

  const url = `/api/isvoter?${queryParams.toString()}`;
  console.log(` Fetching  actif voter: ${url}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("GET /api/isvoter-actifs - Status:", response.status);

  if (!response.ok) {
    const error = await response.json();
    console.error(" Error fetching actifs voter:", error);
    throw new Error(error.error || error.message || "Erreur during fetching actifs voter");
  }

  const result = await response.json();
  console.log(`Fetched ${result.data.length} electeurs actifs (page ${result.page}/${result.totalPages})`);
  return result;
};


export const useElecteursActifs = (params: ElecteursActifsParams = {}) => {
  const { page, limit, dateLimite } = params;
  
  return useQuery<ElecteursActifsResponse, Error>({
    queryKey: ["electeurs-actifs", { page, limit, dateLimite }],
    queryFn: () => fetchElecteursActifs(params),
    staleTime: 30 * 1000,
    placeholderData: (previousData) => previousData,
  });
};


export const usePrefetchElecteursActifs = () => {
  const queryClient = useQueryClient();

  const prefetchElecteursActifs = async (params: ElecteursActifsParams) => {
    await queryClient.prefetchQuery({
      queryKey: ["electeurs-actifs", params],
      queryFn: () => fetchElecteursActifs(params),
      staleTime: 30 * 1000,
    });
  };

  return { prefetchElecteursActifs };
};