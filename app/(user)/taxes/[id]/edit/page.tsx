"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTax, useUpdateTax } from "@/hooks/useTax";

export default function EditTaxPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: tax, isLoading, error } = useTax(id);
  const updateTaxMutation = useUpdateTax();

  const [formData, setFormData] = useState({
    year: "",
    amount: "",
    paidAmount: "",
    isPaid: false,
    paidAt: "",
    dueDate: "",
    description: "",
  });

  useEffect(() => {
    if (tax) {
      setFormData({
        year: tax.year?.toString() || "",
        amount: tax.amount?.toString() || "",
        paidAmount: tax.paidAmount?.toString() || "",
        isPaid: tax.isPaid || false,
        paidAt: tax.paidAt ? new Date(tax.paidAt).toISOString().split("T")[0] : "",
        dueDate: tax.dueDate ? new Date(tax.dueDate).toISOString().split("T")[0] : "",
        description: tax.description || "",
      });
    }
  }, [tax]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: any = { ...formData };
    submitData.year = parseInt(submitData.year);
    submitData.amount = parseFloat(submitData.amount);
    submitData.paidAmount = parseFloat(submitData.paidAmount);
    if (submitData.paidAt) submitData.paidAt = new Date(submitData.paidAt).toISOString();
    if (submitData.dueDate) submitData.dueDate = new Date(submitData.dueDate).toISOString();
    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === "" || submitData[key] === null) {
        delete submitData[key];
      }
    });
    try {
      await updateTaxMutation.mutateAsync({ taxId: parseInt(id), data: submitData });
      router.push(`/taxes/${id}`);
    } catch (error) {
      console.error("Error updating tax:", error);
    }
  };

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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-700 mb-2">Erreur</h2>
          <p className="text-red-600">{error.message || "Impossible de charger les données de la taxe"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!tax) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-700 mb-2">Taxe non trouvée</h2>
          <p className="text-yellow-600">La taxe que vous essayez de modifier n'existe pas.</p>
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
        <h1 className="text-3xl font-bold text-gray-900">Modifier la Taxe</h1>
        <p className="text-gray-600 mt-2">
          Modifiez les informations de la taxe pour l'année {tax.year}.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">Année *</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="2026"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Montant *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="10000"
            />
          </div>
          <div>
            <label htmlFor="paidAmount" className="block text-sm font-medium text-gray-700 mb-2">Montant payé</label>
            <input
              type="number"
              id="paidAmount"
              name="paidAmount"
              value={formData.paidAmount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type de taxe"
            />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">Date d'échéance</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="paidAt" className="block text-sm font-medium text-gray-700 mb-2">Date de paiement</label>
            <input
              type="date"
              id="paidAt"
              name="paidAt"
              value={formData.paidAt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center pt-6">
            <input
              type="checkbox"
              id="isPaid"
              name="isPaid"
              checked={formData.isPaid}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-700">Taxe payée</label>
          </div>
        </div>
        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={() => router.push(`/taxes/${id}`)}
            disabled={updateTaxMutation.isPending}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Voir les détails
          </button>
          <button
            type="button"
            onClick={() => router.push("/taxes")}
            disabled={updateTaxMutation.isPending}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Retour à la liste
          </button>
          <button
            type="submit"
            disabled={updateTaxMutation.isPending}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateTaxMutation.isPending ? "Mise à jour..." : "Mettre à jour"}
          </button>
        </div>
      </form>
      {updateTaxMutation.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">Erreur : {updateTaxMutation.error.message}</p>
        </div>
      )}
    </div>
  );
}
