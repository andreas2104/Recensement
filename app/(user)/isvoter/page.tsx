'use client'

import { useState } from 'react';
import { useElecteursActifs } from '@/hooks/useVoter';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRouter } from 'next/navigation';

export default function ElecteursActifsList() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [dateLimite, setDateLimite] = useState('');
  const limit = 50;

  const { data: user, isLoading: userLoading, error: userError } = useCurrentUser();
  const { data: electeursData, isLoading: electeursLoading, error: electeursError } = useElecteursActifs({
    page: currentPage,
    limit,
    dateLimite: dateLimite || undefined
  });

  // Fonction pour générer le numéro électoral
  const generateNumeroElectoral = (index: number, dateLimite?: string): string => {
    const year = dateLimite ? new Date(dateLimite).getFullYear() : new Date().getFullYear();
    const numeroSequentiel = (index + 1).toString().padStart(6, '0');
    return `EL-${year}-${numeroSequentiel}`;
  };

  // Fonction pour formater la date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Fonction pour calculer l'âge
  const calculateAge = (birthDate: string | Date) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (electeursData?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateLimite(e.target.value);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setDateLimite('');
    setCurrentPage(1);
  };

  // Fonction pour exporter en CSV
  const handleExportCSV = () => {
    if (!electeursData?.data) return;

    const headers = ['Numéro Electoral', 'Nom', 'Prénom', 'CIN', 'Âge', 'Profession', 'Téléphone', 'Situation', 'Date Inscription'];
    const rows = electeursData.data.map((electeur, index) => {
      const globalIndex = (currentPage - 1) * limit + index;
      return [
        generateNumeroElectoral(globalIndex, dateLimite),
        electeur.lastName,
        electeur.firstName,
        electeur.nationalId || '-',
        calculateAge(electeur.birthDate),
        electeur.profession || '-',
        electeur.phone || '-',
        electeur.maritalStatus || '-',
        formatDate(electeur.createdAt)
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `electeurs_actifs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (userLoading || electeursLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des électeurs actifs...</p>
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
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (electeursError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Erreur: {electeursError.message}</p>
        </div>
      </div>
    );
  }

  const electeurs = electeursData?.data || [];
  const totalPages = electeursData?.totalPages || 1;
  const total = electeursData?.total || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header avec info utilisateur */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📋 Liste des Électeurs Actifs</h1>
            <p className="text-sm text-gray-500 mt-1">
              Connecté en tant que: <span className="font-medium">{user.name}</span>
              {user.role === 'ADMIN' && (
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                  Admin
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              disabled={electeurs.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>📥</span>
              <span>Exporter CSV</span>
            </button>
            <button
              onClick={() => router.push('/persons')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              ← Retour
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="dateLimite" className="block text-sm font-medium text-gray-700 mb-2">
                📅 Inscrits avant le :
              </label>
              <input
                type="date"
                id="dateLimite"
                value={dateLimite}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {dateLimite && (
              <button
                onClick={handleResetFilter}
                className="mt-6 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
              >
                Réinitialiser
              </button>
            )}
            <div className="mt-6 flex items-center gap-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700 font-medium">
                {total} électeur{total > 1 ? 's' : ''} actif{total > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Liste vide */}
      {electeurs.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">
            Aucun électeur actif trouvé
            {dateLimite && ` avant le ${formatDate(dateLimite)}`}
          </p>
          {dateLimite && (
            <button
              onClick={handleResetFilter}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Voir tous les électeurs actifs
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Tableau des électeurs */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      N° Electoral
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom & Prénom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CIN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Âge
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profession
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Situation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'inscription
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {electeurs.map((electeur, index) => {
                    const globalIndex = (currentPage - 1) * limit + index;
                    const numeroElectoral = generateNumeroElectoral(globalIndex, dateLimite);
                    
                    return (
                      <tr
                        key={electeur.personId}
                        className="hover:bg-green-50 transition cursor-pointer"
                        onClick={() => router.push(`/persons/${electeur.personId}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono font-semibold text-green-700 bg-green-50 px-2 py-1 rounded">
                            {numeroElectoral}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-semibold">
                                {electeur.firstName?.charAt(0)}{electeur.lastName?.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {electeur.firstName} {electeur.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {electeur.gender === 'M' ? '👨 Homme' : '👩 Femme'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-mono">{electeur.nationalId || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {calculateAge(electeur.birthDate)} ans
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{electeur.profession || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{electeur.phone || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            electeur.maritalStatus === 'MARIE'
                              ? 'bg-pink-100 text-pink-800'
                              : electeur.maritalStatus === 'CELIBATAIRE'
                              ? 'bg-blue-100 text-blue-800'
                              : electeur.maritalStatus === 'DIVORCE'
                              ? 'bg-orange-100 text-orange-800'
                              : electeur.maritalStatus === 'VEUF'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {electeur.maritalStatus || 'Non spécifié'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(electeur.createdAt)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Affichage de <span className="font-semibold">{(currentPage - 1) * limit + 1}</span> à{' '}
              <span className="font-semibold">{Math.min(currentPage * limit, total)}</span> sur{' '}
              <span className="font-semibold">{total}</span> électeur{total > 1 ? 's' : ''}
              {dateLimite && (
                <span className="ml-2 text-green-600">
                  (inscrits avant le {formatDate(dateLimite)})
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Précédent
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Suivant
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}