// components/FokontanyGrid.tsx
'use client';

import React from 'react';
import { useFokontany } from '@/hooks/useFokontany';
import Link from 'next/link';
import { Fokontany } from '@/types/fokontany';

// interface Fokontany {
//   foid: number;
//   nom: string;
//   codeFokontany: string;
//   totalPersonnes: number;
// }

const FokontanyGrid: React.FC = () => {
  const { fokontany, isPending, error } = useFokontany();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Fokontany</h1>

      {isPending && <p className="text-gray-500">Chargement des fokontany...</p>}
      {error && <p className="text-red-500">Erreur: {error.message}</p>}

      {!isPending && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {fokontany.map((fokontany:Fokontany) => (
            <Link
              key={fokontany.id}
              href={`/personnes?id=${fokontany.id}&fokontany=${encodeURIComponent(fokontany.nom)}`}
              className="border p-4 rounded shadow hover:bg-gray-100"
            >
              <h2 className="text-lg font-semibold">{fokontany.nom}</h2>
              <p>Code: {fokontany.codeFokontany}</p>
              <p>Total personnes: {fokontany.totalPersonnes}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FokontanyGrid;