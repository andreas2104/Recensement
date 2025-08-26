'use client';

import React from 'react';
import { usePersonneByFokontany } from '@/hooks/usePersonne';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Personne } from '@/types/personne';

const PersonnesByFokontany: React.FC = () => {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const fokontanyId = idParam && !isNaN(Number(idParam)) && Number(idParam) > 0 ? Number(idParam) : null;
  const fokontanyName = searchParams.get('fokontany') || 'Inconnu';
  const { personnes, isPending, error, fokontanyNotFound } = usePersonneByFokontany(fokontanyId);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Personnes dans {fokontanyName}</h1>

      {!fokontanyId && (
        <p className="text-red-500">Identifiant de fokontany invalide ou manquant dans l'URL.</p>
      )}

      {isPending && <p className="text-gray-500">Chargement des personnes...</p>}
      {fokontanyNotFound && (
        <p className="text-red-500">Le fokontany demandé n'existe pas.</p>
      )}
      {error && !fokontanyNotFound && <p className="text-red-500">Erreur: {error.message}</p>}

      {!isPending && !error && fokontanyId && (
        <div>
          {personnes.length > 0 ? (
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Nom</th>
                  <th className="border p-2">Prénom</th>
                  <th className="border p-2">Sexe</th>
                  <th className="border p-2">CIN</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {personnes.map((personne: Personne) => (
                  <tr key={personne.personneId}>
                    <td className="border p-2">{personne.personneId}</td>
                    <td className="border p-2">{personne.nom}</td>
                    <td className="border p-2">{personne.prenom}</td>
                    <td className="border p-2">{personne.sexe}</td>
                    <td className="border p-2">{personne.CIN}</td>
                    <td className="border p-2">
                      <Link
                        href={`/personne/${personne.personneId}`}
                        className="text-blue-500 hover:underline"
                      >
                        Voir détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Aucune personne trouvée pour le fokontany {fokontanyName}.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonnesByFokontany;