'use client';

import React, { useState } from 'react';
import { useFokontany } from '@/hooks/useFokontany';
import Link from 'next/link';
import { Fokontany } from '@/types/fokontany';
import InputPersonneModal from './inputPersonne'; 

const FokontanyGrid: React.FC = () => {
  const { fokontany, isPending, error } = useFokontany();
  const [isModalOpen, setIsModalOpen] = useState(false); 
  

  const handleModalClose = (newPersonne?: any) => {
    setIsModalOpen(false);
    if (newPersonne) {
  
      console.log('Nouvelle personne ajoutée:', newPersonne);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Liste des Fokontany</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Ajouter une personne
        </button>
      </div>

      {isPending && <p className="text-gray-500">Chargement des fokontany...</p>}
      {error && <p className="text-red-500">Erreur: {error.message}</p>}

      {!isPending && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {fokontany.map((fokontany: Fokontany) => (
            <Link
              key={fokontany.fokontanyId}
              href={`/personne?id=${fokontany.fokontanyId}&fokontany=${encodeURIComponent(fokontany.nom)}`}
              className="border p-4 rounded shadow hover:bg-gray-100"
            >
              <h2 className="text-lg font-semibold">{fokontany.nom}</h2>
              <p>Code: {fokontany.codeFokontany}</p>
              <p>Total personnes: {fokontany.totalPersonnes}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Afficher le modal si isModalOpen est true */}
      {isModalOpen && (
        <InputPersonneModal
          personne={null} // Passer null pour un ajout (pas de personne existante)
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default FokontanyGrid;