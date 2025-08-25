'use client'

import { usePersonne } from "@/hooks/usePersonne"
import { Personne } from "@/types/personne";
import { useState } from "react";
import InputPersonneModal from "./inputPersonne";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; 

const PersonneTable = () => {
  const { personne, isPending, deletePersonne } = usePersonne();
  const [selectedPersonne, setSelectedPersonne] = useState<Personne | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  if (isPending) return <div>Chargement ...</div>

  const pageFarany = currentPage * itemsPerPage;
  const pageVoalohany  = pageFarany - itemsPerPage;
  const currentItems = personne.slice(pageVoalohany, pageFarany);

  const totalPages = Math.ceil(personne.length/ itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1 ) setCurrentPage(currentPage -1);
  }
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage (currentPage + 1);
  }
  
  const handlePageClick = (page:number) => {
    setCurrentPage(page);
  }

  const handleAdd = () => {
    setSelectedPersonne(null);
    setShowModal(true);
  }

  const handleEdit = (p: Personne) => {
    setSelectedPersonne(p);
    setShowModal(true);
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette personne ?")) {
      deletePersonne(id);
    }
  }

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleShowDetails = (p: Personne) => {
    setSelectedPersonne(p);
    setSheetOpen(true);
  }

  return (
    <div className="p-4">
      <button 
        onClick={handleAdd}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        + Ajouter
      </button>
      
      <table className="w-full bg-white border border-gray-200 text-sm md:text-base border-collapse">
        <thead>
          <tr className="bg-gray-100 text-black">
            <th className="border px-2 py-2">Nom</th>
            <th className="border px-2 py-2">Prénom</th>
            <th className="border px-2 py-2">CIN</th>
            <th className="border px-2 py-2">Sexe</th>
            <th className="border px-2 py-2">Adresse</th>
            <th className="border px-2 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {personne.map((p) => (
            <tr key={p.personneId} className="hover:bg-gray-100 text-gray-700">
              <td className="border px-2 py-2">{p.nom}</td>
              <td className="border px-2 py-2">{p.prenom}</td>
              <td className="border px-2 py-2">{p.CIN}</td>
              <td className="border px-2 py-2">{p.sexe}</td>
              <td className="border px-2 py-2 truncate max-w-[150px]">{p.fonenanaAnkehitriny}</td>
              <td className="border px-2 py-2">
                <div className="flex gap-1 flex-wrap">
                  <button 
                    onClick={() => handleEdit(p)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => handleDelete(p.personneId!)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={() => handleShowDetails(p)}
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
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">
            precedent
          </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"}`}
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
      {showModal && (
        <InputPersonneModal
          personne={selectedPersonne}
          onClose={handleCloseModal}
        />
      )}
  
    
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full h-150 py-4 border border-lg max-w-md">
          <SheetHeader>
            <SheetTitle>Détails de la personne</SheetTitle>
          </SheetHeader>
          {selectedPersonne && (
            <div className="space-y-2 px-4  text-sm mt-2">
              <div><strong className="p-4">Nom:</strong> {selectedPersonne.nom}</div>
              <div><strong className="p-4">Prénom:</strong> {selectedPersonne.prenom}</div>
              <div><strong className="p-4">Sexe:</strong> {selectedPersonne.sexe}</div>
              <div><strong className="p-4">Date de naissance:</strong> {selectedPersonne.dateNaissance ? new Date(selectedPersonne.dateNaissance).toLocaleDateString() : "N/A"}</div>
              <div><strong className="p-4">Lieu de naissance:</strong> {selectedPersonne.lieuDeNaissance}</div>
              <div><strong className="p-4">CIN:</strong> {selectedPersonne.CIN}</div>
              <div><strong className="p-4">Date de délivrance:</strong> {selectedPersonne.delivree ? new Date(selectedPersonne.delivree).toLocaleDateString() : "N/A"}</div>
              <div><strong className="p-4">Lieu de délivrance:</strong> {selectedPersonne.lieuDelivree}</div>
              <div><strong className="p-4">Profession:</strong> {selectedPersonne.asa}</div>
              <div><strong className="p-4">Nom Père:</strong> {selectedPersonne.nomPere}</div>
              <div><strong className="p-4">Nom Mère:</strong> {selectedPersonne.nomMere}</div>
              <div><strong className="p-4">Résidence actuelle:</strong> {selectedPersonne.fonenanaAnkehitriny}</div>
              <div><strong className="p-4">Ancienne résidence:</strong> {selectedPersonne.fonenanaTaloha}</div>
              <div><strong className="p-4">Nationalité:</strong> {selectedPersonne.zompirenena}</div>
              <div><strong className="p-4">Contact:</strong> {selectedPersonne.contact}</div>
              <div><strong className="p-4">Fokontany:</strong> {selectedPersonne.fokontany?.nom ?? selectedPersonne.fokontanyId}</div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default PersonneTable;
