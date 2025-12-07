'use client'

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePerson, useDeletePerson } from '@/hooks/usePersons';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useDateFormatter } from '@/hooks/useDateFormatter';

export default function PersonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { formatDate } = useDateFormatter();
  const { data: user, isLoading: userLoading, error: userError } = useCurrentUser();
  const { data: person, isLoading: personLoading, error: personError } = usePerson(id);
  const deletePersonMutation = useDeletePerson();

  // État pour la modal de confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const handleDelete = async () => {
    try {
      await deletePersonMutation.mutateAsync(id);
      router.push('/persons'); // Redirection après suppression
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (userLoading || personLoading) {
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

  if (personError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Erreur: {personError.message}</p>
          <button
            onClick={() => router.push('/persons')}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-700 mb-2">Personne non trouvée</h2>
          <p className="text-yellow-600">La personne que vous recherchez n'existe pas.</p>
          <button
            onClick={() => router.push('/persons')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ← Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header avec bouton retour */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Détails de la personne</h1>
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
          onClick={() => router.push('/persons')}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          ← Retour à la liste
        </button>
      </div>

      {/* Carte de détails */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          {/* En-tête avec nom et statuts */}
          <div className="border-b pb-4 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {person.firstName} {person.lastName}
                </h2>
                <p className="text-gray-600">{person.profession}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className={`px-3 py-1 text-xs font-medium rounded-full text-center ${
                  person.status === 'ACTIF' 
                    ? 'bg-green-100 text-green-800'
                    : person.status === 'DEMENAGER'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {person.status}
                </span>
                {person.isVoter && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 text-center">
                    Électeur
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Grille d'informations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Informations principales */}
            <div className='p-4 shadow rounded-lg bg-gray-50'>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Informations principales</h3>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium text-gray-700">CIN:</span> <span className="text-gray-600">{person.nationalId}</span></p>
                <p className="text-sm"><span className="font-medium text-gray-700">Téléphone:</span> <span className="text-gray-600">{person.phone}</span></p>
                <p className="text-sm"><span className="font-medium text-gray-700">Situation:</span> <span className="text-gray-600">{person.maritalStatus}</span></p>
                <p className="text-sm"><span className="font-medium text-gray-700">Adresse actuelle:</span> <span className="text-gray-600">{person.currentAddress}</span></p>
              </div>
            </div>

            {/* Informations de naissance et CIN */}
            <div className='p-4 shadow rounded-lg bg-gray-50'>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Naissance et CIN</h3>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium text-gray-700">Date de naissance:</span> <span className="text-gray-600">{formatDate(person.birthDate)}</span></p>
                <p className="text-sm"><span className="font-medium text-gray-700">Lieu de naissance:</span> <span className="text-gray-600">{person.birthPlace}</span></p>
                <p className="text-sm"><span className="font-medium text-gray-700">Nationalité:</span> <span className="text-gray-600">{person.nationality}</span></p>
                <p className="text-sm"><span className="font-medium text-gray-700">Délivré à:</span> <span className="text-gray-600">{person.issuedPlace}</span></p>
                <p className="text-sm"><span className="font-medium text-gray-700">Date de délivrance:</span> <span className="text-gray-600">{formatDate(person.issuedDate)}</span></p>
              </div>
            </div>

            {/* Informations familiales */}
            <div className='p-4 shadow rounded-lg bg-gray-50'>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Informations familiales</h3>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium text-gray-700">Père:</span> <span className="text-gray-600">{person.fatherName || 'Non renseigné'}</span></p>
                <p className="text-sm"><span className="font-medium text-gray-700">Mère:</span> <span className="text-gray-600">{person.motherName || 'Non renseigné'}</span></p>
                <p className="text-sm"><span className="font-medium text-gray-700">Ancienne adresse:</span> <span className="text-gray-600">{person.previousAddress}</span></p>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="mt-6 pt-6 border-t flex gap-4 justify-between">
            <button
              onClick={() => router.push('/persons')}
              className='px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              ← Retour à la liste
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/persons/${person.personId}/edit`)}
                className='px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                Modifier
              </button>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={deletePersonMutation.isPending}
                className='px-6 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {deletePersonMutation.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{person.firstName} {person.lastName}</span> ? 
              Cette action est irréversible.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deletePersonMutation.isPending}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deletePersonMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletePersonMutation.isPending ? 'Suppression...' : 'Oui, supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}