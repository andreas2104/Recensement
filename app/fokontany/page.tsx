"use client";

import { useState } from "react";
import { useFokontany } from "@/hooks/useFokontany";
import { Fokontany } from "@/types/fokontany";

export default function FokontanyPage() {
  const { fokontany, isPending, error, addFokontany, updateFokontany, deleteFokontany } = useFokontany();

  const [formData, setFormData] = useState<{
    fokontanyId?: number;
    codeFokontany: string;
    nom: string;
  }>({
    codeFokontany: "",
    nom: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.codeFokontany || !formData.nom) {
      alert("Le code et le nom du Fokontany sont requis.");
      return;
    }

    if (isEditing && formData.fokontanyId !== undefined) {
      updateFokontany(
        {
          fokontanyId: formData.fokontanyId,
          nom: formData.nom,
          codeFokontany: formData.codeFokontany,
          createdAt: new Date(), 
        } as Fokontany,
        {
          onSuccess: () => {
            setFormData({ codeFokontany: "", nom: "" });
            setIsEditing(false);
            alert("Fokontany mis à jour avec succès !");
          },
          onError: (err) => {
            console.error("Erreur de mise à jour:", err);
            alert("Erreur lors de la mise à jour.");
          },
        }
      );
    } else {
      addFokontany(
        { 
          codeFokontany: formData.codeFokontany, 
          nom: formData.nom,
          createdAt: new Date(), 
        } as Fokontany,
        {
          onSuccess: () => {
            setFormData({ codeFokontany: "", nom: "" });
            alert("Fokontany ajouté avec succès !");
          },
          onError: (err) => {
            console.error("Erreur d'ajout:", err);
            alert("Erreur lors de l'ajout.");
          },
        }
      );
    }
  };

  const handleEdit = (f: Fokontany) => {
    console.log('🔍 Fokontany à éditer:', f);
    console.log('🔍 fokontanyId:', f.fokontanyId);
    
    setFormData({
      fokontanyId: f.fokontanyId,
      codeFokontany: f.codeFokontany,
      nom: f.nom,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    console.log('🔍 ID à supprimer:', id);
    
    if (!id) {
      alert('Erreur: ID manquant');
      return;
    }

    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fokontany ?")) {
      deleteFokontany(id, {
        onSuccess: () => {
          alert("Fokontany supprimé avec succès !");
        },
        onError: (err) => {
          console.error("Erreur de suppression:", err);
          alert("Erreur lors de la suppression.");
        },
      });
    }
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj instanceof Date && !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString()
      : "Invalid Date";
  };

  console.log('🔍 Données fokontany:', fokontany);
  
  if (isPending) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div className="p-4 space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Gestion des Fokontany</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? "Modifier un Fokontany" : "Ajouter un Fokontany"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="codeFokontany"
            value={formData.codeFokontany}
            onChange={handleChange}
            placeholder="Code Fokontany"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Nom du Fokontany"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              {isEditing ? "Mettre à jour" : "Ajouter"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ codeFokontany: "", nom: "" });
                  setIsEditing(false);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Liste des Fokontany</h2>
        <ul className="space-y-4">
          {fokontany?.map((f) => {
            if (!f.fokontanyId) {
              console.warn('⚠️ fokontanyId manquant pour:', f);
              return null;
            }

            return (
              <li
                key={f.fokontanyId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
              >
                <div>
                  <span className="font-medium text-lg">{f.nom}</span>
                  <span className="block text-sm text-gray-500">
                    Code: {f.codeFokontany} | ID: {f.fokontanyId} | Créé le: {formatDate(f.createdAt)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(f)}
                    className="px-3 py-1 text-sm text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(f.fokontanyId)}
                    className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                    disabled={!f.fokontanyId} 
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            );
          }).filter(Boolean)} 
        </ul>
      </div>
    </div>
  );
}