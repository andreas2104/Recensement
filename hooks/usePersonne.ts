import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Personne } from "@/types/personne";
import { addPersonne,deletePersonne,updatePersonne ,fetchPersonnes,getPersonneById} from "@/services/personneService";


export const usePersonne = () => {
  const queryClient = useQueryClient();

 const {data: personne = [], isPending,error } = useQuery({
  queryKey: ['personne'],
  queryFn: fetchPersonnes,
  refetchOnWindowFocus: false,
 });

 const addMutation = useMutation({
  mutationFn: (personne: Personne) => addPersonne(personne),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['personne']});
  }
 });

const updateMutation = useMutation({
  mutationFn: (personne: Personne) => updatePersonne(personne),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['personne']})
  }
});

const deleteMutation = useMutation({
  mutationFn: (id: number) => deletePersonne(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['personne']});
  }
});

return {
  personne,
  isPending,
  error,
  addPersonne:addMutation.mutate,
  updatePersonne: updateMutation.mutate,
  deletePersonne: deleteMutation.mutate
}
}
export const usePersonneById = (personneId: number | null) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['personne', personneId],
    queryFn: () => {
      if (personneId === null) {
        return Promise.resolve(null);
      }
      return getPersonneById(personneId);
    },
    enabled: personneId !== null,
    refetchOnWindowFocus: false,
  });

  return {
    personne: data as Personne | null,
    isPending,
    error,
  };
};