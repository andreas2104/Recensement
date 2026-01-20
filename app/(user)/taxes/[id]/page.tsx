"use client";

import { useTax } from "@/hooks/useTax";
import { useRouter, useParams } from "next/navigation";

export default function TaxDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { data: tax, isLoading, error } = useTax(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error || !tax) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-700 mb-2">Erreur</h2>
          <p className="text-red-600">{error?.message || "Impossible de charger la taxe."}</p>
          <button
            onClick={() => router.push("/taxes")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Détail de la Taxe</h1>
        <p className="text-gray-600 mt-2">Année : {tax.year}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div><strong>Montant :</strong> {tax.amount} Ar</div>
        <div><strong>Montant payé :</strong> {tax.paidAmount} Ar</div>
        <div><strong>Payée :</strong> {tax.isPaid ? "Oui" : "Non"}</div>
        <div><strong>Date de paiement :</strong> {tax.paidAt ? new Date(tax.paidAt).toLocaleDateString() : "-"}</div>
        <div><strong>Date d'échéance :</strong> {tax.dueDate ? new Date(tax.dueDate).toLocaleDateString() : "-"}</div>
        <div><strong>Description :</strong> {tax.description || "-"}</div>
        <div><strong>Personne :</strong> {tax.person ? `${tax.person.firstName} ${tax.person.lastName}` : "-"}</div>
      </div>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => router.push(`/taxes/${id}/edit`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Modifier
        </button>
        <button
          onClick={() => router.push("/taxes")}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
        >
          Retour à la liste
        </button>
      </div>
    </div>
  );
}
