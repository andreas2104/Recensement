'use client'


interface user {
  userId: number;
  email: string;
  role: "USER" | "ADMIN";
}

const fetchUser = async (): Promise<user> => {
  const response = await fetch("/api/users", {
    method:'GET',
    credentials: 'include', 
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("error fetching person", error);
    throw new Error(error.error || error.message)
  }

  const result = await response.json();
  console.log(`fetched, ${result.length} persons`);
  return result;



  return (
    <div>
      Hlllo persones
    </div>
  );
}