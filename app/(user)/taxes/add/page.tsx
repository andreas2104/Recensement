"use client";

import { useState, useEffect } from "react";
import { useCreateTax } from "@/hooks/useTax";
import { usePersons } from "@/hooks/usePersons";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddTaxPage() {
  const router = useRouter();
  const { data: persons = [], isLoading: isLoadingPersons } = usePersons();
  const createTax = useCreateTax();

  const [formData, setFormData] = useState({
    personId: "",
    year: new Date().getFullYear(),
    amount: "",
    description: "Taxe communale",
    dueDate: "",
  });

  const [searchPerson, setSearchPerson] = useState("");
  const [showPersonDropdown, setShowPersonDropdown] = useState(false);

  const filteredPersons = persons.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchPerson.toLowerCase())
  );

  const selectedPerson = persons.find((p) => p.personId === parseInt(formData.personId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.personId || !formData.amount) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await createTax.mutateAsync({
        personId: parseInt(formData.personId),
        year: formData.year,
        amount: parseFloat(formData.amount),
        description: formData.description || undefined,
        dueDate: formData.dueDate || undefined,
      });

      router.push("/taxes");
    } catch (error) {
      console.error("Error creating tax:", error);
    }
  };

  const taxTypes = [
    "Taxe communale",
    "Impôt foncier",
    "Taxe de résidence",
    "Taxe d'habitation",
    "Cotisation annuelle",
    "Autre",
  ];

  if (isLoadingPersons) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/taxes"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Nouvelle Taxe</h1>
        <p className="text-gray-600 mt-1">Enregistrer une nouvelle taxe pour une personne</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Person Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personne <span className="text-red-500">*</span>
          </label>
          {selectedPerson ? (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">
                  {selectedPerson.firstName} {selectedPerson.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedPerson.nationalId || "Pas de CIN"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, personId: "" });
                  setSearchPerson("");
                }}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une personne..."
                value={searchPerson}
                onChange={(e) => {
                  setSearchPerson(e.target.value);
                  setShowPersonDropdown(true);
                }}
                onFocus={() => setShowPersonDropdown(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {showPersonDropdown && searchPerson && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredPersons.length > 0 ? (
                    filteredPersons.slice(0, 10).map((person) => (
                      <button
                        key={person.personId}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, personId: person.personId.toString() });
                          setSearchPerson("");
                          setShowPersonDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                      >
                        <p className="font-medium text-gray-900">
                          {person.firstName} {person.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {person.nationalId || "Pas de CIN"} - {person.currentAddress}
                        </p>
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-gray-500 text-center">Aucune personne trouvée</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Year */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Année <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant (Ar) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="100"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="Ex: 50000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de taxe
          </label>
          <select
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {taxTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date d'échéance
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={createTax.isPending}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createTax.isPending ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création...
              </span>
            ) : (
              "Créer la taxe"
            )}
          </button>
          <Link
            href="/taxes"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
