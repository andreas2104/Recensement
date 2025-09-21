import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Admin } from "@/types/admin";
import { 
  fetchAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminById
} from "@/services/adminService";

export const useAdmin = () => {
  const queryClient = useQueryClient();


  const { data: admins = [], isPending, error } = useQuery({
    queryKey: ['admins'],
    queryFn: fetchAdmins,
    refetchOnWindowFocus: false,
  });


  const addMutation = useMutation({
    mutationFn: (admin: Admin) => addAdmin(admin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    }
  });


  const updateMutation = useMutation({
    mutationFn: (admin: Admin) => updateAdmin(admin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    }
  });


  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    }
  });

  return {
    admins,
    isPending,
    error,
    addAdmin: addMutation.mutate,
    updateAdmin: updateMutation.mutate,
    deleteAdmin: deleteMutation.mutate
  };
};


export const useAdminById = (adminId: number | null) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['admin', adminId],
    queryFn: () => {
      if (adminId === null) {
        return Promise.resolve(null);
      }
      return getAdminById(adminId);
    },
    enabled: adminId !== null,
    refetchOnWindowFocus: false,
  });

  return {
    admin: data as Admin | null,
    isPending,
    error,
  };
};
