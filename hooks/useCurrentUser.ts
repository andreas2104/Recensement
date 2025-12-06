import { useQuery } from "@tanstack/react-query";

interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
}

const fetchCurrentUser = async (): Promise<User> => {
  console.log("🔍 Fetching current user...");

  const response = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
  });

  console.log("📡 Response status:", response.status);
  console.log("📡 Response ok:", response.ok);

  if (!response.ok) {
    const error = await response.json();
    console.error("❌ Error response:", error);
    throw new Error(error.error || "Failed to fetch current user");
  }

  const data = await response.json();
  console.log("✅ User fetched successfully:", data);
  return data;
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user"], // ✅ Correspond maintenant à LoginPage
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
