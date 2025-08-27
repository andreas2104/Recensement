'use client';

import React, { useState } from 'react';
import { usePersonneByFokontany } from '@/hooks/usePersonne';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Personne } from '@/types/personne';
import InputPersonneModal from './inputPersonne';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import toast, { Toaster } from 'react-hot-toast';

const PersonnesByFokontany: React.FC = () => {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const fokontanyId = idParam && !isNaN(Number(idParam)) && Number(idParam) > 0 ? Number(idParam) : null;
  const fokontanyName = searchParams.get('fokontany') || 'Inconnu';
  const { personnes, isPending, error, fokontanyNotFound } = usePersonneByFokontany(fokontanyId);
  const { addPersonne, updatePersonne, deletePersonne } = usePersonneByFokontany(fokontanyId);

  const [selectedPersonne, setSelectedPersonne] = useState<Personne | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  if (isPending) return <div className="text-gray-500 text-center p-4">Chargement des personnes...</div>;

  if (!fokontanyId) {
    return <p className="text-red-500 text-center p-4">Identifiant de fokontany invalide ou manquant dans l'URL.</p>;
  }

  if (fokontanyNotFound) {
    return <p className="text-red-500 text-center p-4">Le fokontany demandé n'existe pas.</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center p-4">Erreur: {error.message}</p>;
  }

  const pageFarany = currentPage * itemsPerPage;
  const pageVoalohany = pageFarany - itemsPerPage;
  const currentItems = personnes.slice(pageVoalohany, pageFarany);
  const totalPages = Math.ceil(personnes.length / itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleAdd = () => {
    setSelectedPersonne(null);
    setShowModal(true);
  };

  const handleEdit = (p: Personne) => {
    setSelectedPersonne(p);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette personne ?')) {
      try {
        await deletePersonne(id);
        toast.success('Personne supprimée avec succès !');
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        toast.error('Erreur lors de la suppression de la personne.');
      }
    }
  };

  const handleShowDetails = (p: Personne) => {
    setSelectedPersonne(p);
    setSheetOpen(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4">Personnes dans {fokontanyName}</h1>

      {personnes.length === 0 ? (
        <div className="text-center p-4">
          <p className="text-gray-600 mb-4">Aucune personne pour l'instant, créez-en une.</p>
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Créer une personne
          </button>
          {showModal && (
            <InputPersonneModal
              personne={selectedPersonne}
              onClose={handleCloseModal}
              onSave={(personne: Personne) => {
                try {
                  addPersonne({ ...personne, fokontanyId });
                  toast.success('Personne ajoutée avec succès !');
                } catch (err) {
                  console.error('Erreur lors de l\'ajout:', err);
                  toast.error('Erreur lors de l\'ajout de la personne.');
                }
                handleCloseModal();
              }}
            />
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
          >
            + Ajouter
          </button>

          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="border p-2">ID</th>
                <th className="border p-2">Nom</th>
                <th className="border p-2">Prénom</th>
                <th className="border p-2">Sexe</th>
                <th className="border p-2">CIN</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((personne: Personne) => (
                <tr key={personne.personneId} className="hover:bg-gray-100 text-gray-700">
                  <th className="border p-2">{personne.personneId}</th>
                  <td className="border p-2">{personne.nom}</td>
                  <td className="border p-2">{personne.prenom}</td>
                  <td className="border p-2">{personne.sexe}</td>
                  <td className="border p-2">{personne.CIN}</td>
                  <td className="border p-2">
                    <div className="flex gap-1 flex-wrap">
                      <button
                        onClick={() => handleEdit(personne)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(personne.personneId!)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Supprimer
                      </button>
                      <button
                        onClick={() => handleShowDetails(personne)}
                        className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                      >
                        Détails
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Précédent
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {personnes.length > 0 && showModal && (
        <InputPersonneModal
          personne={selectedPersonne}
          onClose={handleCloseModal}
          onSave={(personne: Personne) => {
            if (selectedPersonne) {
              try {
                updatePersonne({ ...personne, personneId: selectedPersonne.personneId });
                toast.success('Personne modifiée avec succès !');
              } catch (err) {
                console.error('Erreur lors de la modification:', err);
                toast.error('Erreur lors de la modification de la personne.');
              }
            } else {
              try {
                addPersonne({ ...personne, fokontanyId });
                toast.success('Personne ajoutée avec succès !');
              } catch (err) {
                console.error('Erreur lors de l\'ajout:', err);
                toast.error('Erreur lors de l\'ajout de la personne.');
              }
            }
            handleCloseModal();
          }}
        />
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full max-w-md py-4 border border-lg">
          <SheetHeader>
            <SheetTitle>Détails de la personne</SheetTitle>
          </SheetHeader>
          {selectedPersonne && (
            <div className="space-y-2 px-4 text-sm mt-2">
              <div>
                <strong className="pr-4">Nom:</strong> {selectedPersonne.nom}
              </div>
              <div>
                <strong className="pr-4">Prénom:</strong> {selectedPersonne.prenom}
              </div>
              <div>
                <strong className="pr-4">Sexe:</strong> {selectedPersonne.sexe}
              </div>
              <div>
                <strong className="pr-4">Date de naissance:</strong>{' '}
                {selectedPersonne.dateNaissance
                  ? new Date(selectedPersonne.dateNaissance).toLocaleDateString()
                  : 'N/A'}
              </div>
              <div>
                <strong className="pr-4">Lieu de naissance:</strong> {selectedPersonne.lieuDeNaissance}
              </div>
              <div>
                <strong className="pr-4">CIN:</strong> {selectedPersonne.CIN}
              </div>
              <div>
                <strong className="pr-4">Date de délivrance:</strong>{' '}
                {selectedPersonne.delivree
                  ? new Date(selectedPersonne.delivree).toLocaleDateString()
                  : 'N/A'}
              </div>
              <div>
                <strong className="pr-4">Lieu de délivrance:</strong> {selectedPersonne.lieuDelivree}
              </div>
              <div>
                <strong className="pr-4">Profession:</strong> {selectedPersonne.asa}
              </div>
              <div>
                <strong className="pr-4">Nom Père:</strong> {selectedPersonne.nomPere}
              </div>
              <div>
                <strong className="pr-4">Nom Mère:</strong> {selectedPersonne.nomMere}
              </div>
              <div>
                <strong className="pr-4">Résidence actuelle:</strong>{' '}
                {selectedPersonne.fonenanaAnkehitriny}
              </div>
              <div>
                <strong className="pr-4">Ancienne résidence:</strong>{' '}
                {selectedPersonne.fonenanaTaloha}
              </div>
              <div>
                <strong className="pr-4">Nationalité:</strong> {selectedPersonne.zompirenena}
              </div>
              <div>
                <strong className="pr-4">Contact:</strong> {selectedPersonne.contact}
              </div>
              <div>
                <strong className="pr-4">Fokontany:</strong>{' '}
                {selectedPersonne.fokontany?.nom ?? selectedPersonne.fokontanyId}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PersonnesByFokontany;