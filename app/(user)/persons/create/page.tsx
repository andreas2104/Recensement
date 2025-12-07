'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreatePerson } from '@/hooks/usePersons';

export default function CreatePersonPage() {
  const router = useRouter();
  const createPersonMutation = useCreatePerson();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'M',
    birthDate: '',
    birthPlace: '',
    nationality: 'Malagasy',
    nationalId: '',
    issuedDate: '', 
    issuedPlace: '', 
    profession: '',
    phone: '',
    fatherName: '',
    motherName: '',
    currentAddress: '',
    previousAddress: '',
    maritalStatus: 'CELIBATAIRE',
    status: 'ACTIF',
    isVoter: false,
  });

  const [showCinFields, setShowCinFields] = useState(false); // Pour gérer l'affichage des champs CIN

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Préparer les données pour l'API
    const submitData: any = { ...formData };
    
    // Si pas de CIN, on retire les champs CIN
    if (!showCinFields || !submitData.nationalId) {
      delete submitData.nationalId;
      delete submitData.issuedDate;
      delete submitData.issuedPlace;
    } else {
      // Si CIN fourni, s'assurer que les dates sont au bon format
      if (submitData.issuedDate) {
        submitData.issuedDate = new Date(submitData.issuedDate).toISOString();
      }
    }
    
    // Convertir la date de naissance
    if (submitData.birthDate) {
      submitData.birthDate = new Date(submitData.birthDate).toISOString();
    }
    
    try {
      await createPersonMutation.mutateAsync(submitData);
      router.push('/persons');
    } catch (error) {
      console.error('Error creating person:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Créer une Nouvelle Personne</h1>
        <p className="text-gray-600 mt-2">
          Remplissez le formulaire ci-dessous pour ajouter une nouvelle personne au registre.
          Les champs marqués d'un * sont obligatoires.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        
        {/* Informations de base */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations Personnelles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Jean"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rakoto"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Genre *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                Date de naissance *
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700 mb-2">
                Lieu de naissance *
              </label>
              <input
                type="text"
                id="birthPlace"
                name="birthPlace"
                value={formData.birthPlace}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Antananarivo"
              />
            </div>

            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                Nationalité *
              </label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* CIN et identification - Optionnel */}
        <div className="border-b pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Carte d'Identité Nationale (Optionnel)</h2>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasCin"
                checked={showCinFields}
                onChange={(e) => setShowCinFields(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="hasCin" className="ml-2 block text-sm text-gray-700">
                Cette personne a une CIN
              </label>
            </div>
          </div>
          
          {showCinFields && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div>
                <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro CIN
                </label>
                <input
                  type="text"
                  id="nationalId"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123456789012"
                />
              </div>

              <div>
                <label htmlFor="issuedDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date de délivrance
                </label>
                <input
                  type="date"
                  id="issuedDate"
                  name="issuedDate"
                  value={formData.issuedDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="issuedPlace" className="block text-sm font-medium text-gray-700 mb-2">
                  Lieu de délivrance
                </label>
                <input
                  type="text"
                  id="issuedPlace"
                  name="issuedPlace"
                  value={formData.issuedPlace}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Antananarivo"
                />
              </div>
            </div>
          )}
        </div>

        {/* Profession et contacts */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Profession et Contacts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
                Profession *
              </label>
              <input
                type="text"
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enseignant"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+261321234567"
              />
            </div>
          </div>
        </div>

        {/* Parents */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Parents</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom du père (Optionnel)
              </label>
              <input
                type="text"
                id="fatherName"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rakoto Andriamalala"
              />
            </div>

            <div>
              <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la mère (Optionnel)
              </label>
              <input
                type="text"
                id="motherName"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rasoa Marie"
              />
            </div>
          </div>
        </div>

        {/* Adresses */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Adresses</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="currentAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse actuelle *
              </label>
              <textarea
                id="currentAddress"
                name="currentAddress"
                value={formData.currentAddress}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Lot ABC, Ambohimanambola"
              />
            </div>

            <div>
              <label htmlFor="previousAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Ancienne adresse *
              </label>
              <textarea
                id="previousAddress"
                name="previousAddress"
                value={formData.previousAddress}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ankadindratombo"
              />
            </div>
          </div>
        </div>

        {/* Statut et options */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Statut et Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-2">
                Situation matrimoniale
              </label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="CELIBATAIRE">Célibataire</option>
                <option value="MARIE">Marié(e)</option>
                <option value="DIVORCE">Divorcé(e)</option>
                <option value="VEUF">Veuf/Veuve</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Statut dans le fokontany
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ACTIF">Actif</option>
                <option value="DEMENAGER">Déménagé</option>
                <option value="DECEDE">Décédé</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isVoter"
                  name="isVoter"
                  checked={formData.isVoter}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isVoter" className="ml-2 block text-sm text-gray-700">
                  Est électeur
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={createPersonMutation.isPending}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Annuler
          </button>
          
          <button
            type="submit"
            disabled={createPersonMutation.isPending}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createPersonMutation.isPending ? 'Création...' : 'Créer la personne'}
          </button>
        </div>
      </form>

      {createPersonMutation.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">
            Erreur : {createPersonMutation.error.message}
          </p>
        </div>
      )}
    </div>
  );
}