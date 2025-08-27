import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFokontany, deleteFokontany, fetchFokontany, getFokontanyById, updateFokontany } from "@/services/fokontanyService";
import { Fokontany } from "@/types/fokontany";

export const useFokontany = () => {
  const queryClient = useQueryClient();

  const { data: fokontany = [], isPending, error } = useQuery({
    queryKey: ['fokontany'],
    queryFn: fetchFokontany,
    refetchOnWindowFocus: false,
  });

  const addMutation = useMutation({
    mutationFn: (fokontany: Fokontany) => addFokontany(fokontany),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fokontany'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (fokontany: Fokontany) => updateFokontany(fokontany),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fokontany'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteFokontany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fokontany'] });
    },
  });

  return {
    fokontany,
    isPending,
    error,
    addFokontany: addMutation.mutate,
    updateFokontany: updateMutation.mutate,
    deleteFokontany: deleteMutation.mutate,
  };
};

export const useFokontanyById = (fokontanyId: number | null) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['fokontany', fokontanyId],
    queryFn: () => {
      if (fokontanyId === null) {
        return Promise.resolve(null);
      }
      return getFokontanyById(fokontanyId);
    },
    enabled: fokontanyId !== null,
    refetchOnWindowFocus: false,
  });

  return {
    fokontany: data as Fokontany | null,
    isPending,
    error,
  };
};