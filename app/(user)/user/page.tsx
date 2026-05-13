'use client'

import { useEffect, useState } from 'react';

interface User {
  userId: number;
  email: string;
  role: "USER" | "ADMIN";
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users", {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || errData.message || "Failed to fetch users");
        }

        const result = await response.json();
        setUsers(result);
      } catch (err: any) {
        console.error("error fetching users", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Utilisateurs</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.userId} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            {user.email} - <span className="text-sm font-semibold">{user.role}</span>
          </li>
        ))}
        {users.length === 0 && <li>Aucun utilisateur trouvé.</li>}
      </ul>
    </div>
  );
}