import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Personne } from "@/types/personne";
import { addPersonne, deletePersonne, updatePersonne, fetchPersonnes } from "@/services/personneService";

export const usePersonne = () => {
  const queryClient = useQueryClient();

  const { data, isLoading: isPending, error } = useQuery<Personne[]>({
    queryKey: ['personne'],
    queryFn: fetchPersonnes,
    refetchOnWindowFocus: false,
  });


  const addMutation = useMutation({
    mutationFn: (personne: Omit<Personne, "personneId" | "createdAt">) => addPersonne(personne),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personne'] });
    },
  });


  const updateMutation = useMutation({
    mutationFn: (personne: Personne) => updatePersonne(personne),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personne'] });
    },
  });


  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePersonne(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personne'] });
    },
  });

  return {
    personne: data ?? [],
    isPending,
    error,
    addPersonne: addMutation.mutate,
    updatePersonne: updateMutation.mutate,
    deletePersonne: deleteMutation.mutate,
  };
};
