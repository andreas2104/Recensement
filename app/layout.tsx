
'use client';

import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Inter } from 'next/font/google';
import Nav from './component/NavBar';
import Header from './component/Header';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body className={inter.className}>
          <Header/>
          <Nav/>
          <main className="container mx-auto p-4">{children}</main>
        </body>
      </html>
    </QueryClientProvider>
  );
}