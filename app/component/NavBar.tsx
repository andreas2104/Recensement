'use client'

import { Personne } from "@/types/personne"
import { useEffect, useState } from "react"

export default function NavPage() {
  const {personne, setPersonne} = useState<Personne| null>(null); 
  
  useEffect(() => {
    const getPersonne =async () => {

      
    }
  })
  return (
    <>
    <div className="min-h-screen  p-4 bg-gray-50">
      <div className="text-gray-500">
mnmnn
      </div>
    </div>
    </>
  )
}