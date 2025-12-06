'use client'

import { usePersons } from '@/hooks/usePersons';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRouter } from 'next/navigation';
import { useDateFormatter } from '@/hooks/useDateFormatter';

export default function PersonList() {
  const router = useRouter();
    const {formatDate} = useDateFormatter();
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
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // ✅ Erreur de chargement des personnes
  if (personsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Erreur: {personsError.message}</p>
        </div>
      </div>
    );
  }

  // ✅ Liste vide
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
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + Ajouter une personne
        </button>
      </div>

      {/* Liste des personnes */}
      <div>

      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {persons.map((person) => (
            <li 
              key={person.nationalId} 
              className="p-4 hover:bg-gray-50 transition cursor-pointer"
              onClick={() => router.push(`/persons/${person.personId}`)}
            >
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className='flex-1 p-4 shadow rounded-lg overflow-hidden'>
                  <p className="text-lg font-semibold text-gray-900">
                    {person.firstName} {person.lastName}
                  </p>
                  <p>Adresse: {person.currentAddress} </p>
                  <p className="text-sm text-gray-500">CIN: {person.nationalId}</p>
                  <p className="text-sm text-gray-500">
                    {person.profession} •Contact {person.phone}
                  </p>
                  <p>Situation: {person.maritalStatus}</p>
                </div>
                <div className='flex-1 p-4 shadow rounded-lg overflow-hidden'>
                  <p>Née le: {formatDate(person.birthDate)}</p>
                  <p>Lieu de Naissance: {person.birthPlace}</p>
                  <p>Profession: {person.profession}</p>
                  <p>Delivré a: {person.issuedPlace}</p>
                  <p>Date de Delivrance: {formatDate(person.issuedDate)}</p>
                  <p>Nationalité: {person.nationality}</p>
                </div>
                <div className='flex-1 p-4 shadow rounded-lg overflow-hidden'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-4'>
                  <div className='p-3 shadow rounded-lg'>
                  <p>Ancienne Adresse: {person.previousAddress}</p>
                  </div>
                <div className='p-3 shadow rounded-lg'>
                  <p>Père: {person.fatherName}</p><p>Mère: {person.motherName}</p>
                  <p>Electeur : {person.isVoter}</p>
                </div>
                  
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    person.status === 'ACTIF' 
                      ? 'bg-green-100 text-green-800'
                      : person.status === 'DEMENAGER'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {person.status}
                  </span>
                  {person.isVoter && (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      Électeur
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}