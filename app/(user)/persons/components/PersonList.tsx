'use client'

import { usePersons } from '@/hooks/usePersons';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRouter } from 'next/navigation';

export default function PersonList() {
  const router = useRouter();

  // Récupérer l'utilisateur connecté
  const { data: user, isLoading: userLoading, error: userError } = useCurrentUser();
  const { data: persons, isLoading: personsLoading, error: personsError } = usePersons();
  
  if (userLoading || personsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Non authentifié</p>
          <button
            onClick={() => router.push('/connexion')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // Erreur de chargement des personnes
  if (personsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Erreur: {personsError.message}</p>
        </div>
      </div>
    );
  }

  //  Liste vide
  if (!persons || persons.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header avec info utilisateur */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Liste des Personnes</h1>
            <p className="text-sm text-gray-500 mt-1">
              Connecté en tant que: <span className="font-medium">{user.name}</span>
              {user.role === 'ADMIN' && (
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                  Admin
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => router.push('/persons/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Ajouter
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">Aucune personne trouvée</p>
          <button
            onClick={() => router.push('/persons/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Créer la première personne
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header avec info utilisateur */}
      <div className="mb-6 flex items-center justify-between">
        <button
        onClick={() => router.push('/isvoter')}
        className='px-4 py-2  bg-green-500 text-white rounded hover:bg-green-700 transition flex items-center gap-2'>Liste electoral</button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Liste des Personnes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Connecté en tant que: <span className="font-medium">{user.name}</span> 
            {user.role === 'ADMIN' && (
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                Admin
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => router.push('/persons/create')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span>+</span>
          <span>Ajouter une personne</span>
        </button>
      </div>

      {/* Tableau des personnes */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom & Prénom
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CIN
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profession
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Situation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adresse
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {persons.map((person) => (
                <tr 
                  key={person.nationalId} 
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => router.push(`/persons/${person.personId}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {person.firstName?.charAt(0)}{person.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {person.firstName} {person.lastName}
                        </div>
                      
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">{person.nationalId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{person.profession || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{person.phone || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      person.maritalStatus === 'MARRIED' 
                        ? 'bg-green-100 text-green-800'
                        : person.maritalStatus === 'SINGLE'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {person.maritalStatus || 'Non spécifié'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={person.currentAddress}>
                      {person.currentAddress || '-'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer avec stats et pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold">{persons.length}</span> personne(s)
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            Précédent
          </button>
          <span className="text-sm text-gray-700">Page 1 sur 1</span>
          <button 
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}