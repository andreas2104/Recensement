'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react"
// import NavPage from "../component/NavBar";

export default function DashbLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new  QueryClient);
  
  return(
    <QueryClientProvider client={queryClient}>
      {/* <NavPage/> */}
      <body>
        {children}
      </body>
    </QueryClientProvider>
  )
}