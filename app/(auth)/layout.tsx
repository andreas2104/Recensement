'use client'

import { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayoutProps({ children }: AuthLayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      {children}
    </div>
  )
}