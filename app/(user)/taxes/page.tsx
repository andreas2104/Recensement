"use client";

import { useState, useMemo } from "react";
import { useTaxes, useDeleteTax, useMarkTaxAsPaid, Tax } from "@/hooks/useTax";
import { usePersons } from "@/hooks/usePersons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TaxesPage() {
  const router = useRouter();
  const { data: taxes = [], isLoading, refetch } = useTaxes();
  const { data: persons = [] } = usePersons();
  const deleteTax = useDeleteTax();
  const markAsPaid = useMarkTaxAsPaid();

  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get unique years from taxes
  const years = useMemo(() => {
    const yearsSet = new Set(taxes.map((t) => t.year));
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [taxes]);

  // Filter taxes
  const filteredTaxes = useMemo(() => {
    return taxes.filter((tax) => {
      // Filter by year
      if (filterYear !== "all" && tax.year !== parseInt(filterYear)) {
        return false;
      }

      // Filter by status
      if (filterStatus === "paid" && !tax.isPaid) {
        return false;
      }
      if (filterStatus === "unpaid" && tax.isPaid) {
        return false;
      }

      // Filter by search (person name)
      if (searchQuery) {
        const personName = `${tax.person?.firstName || ""} ${tax.person?.lastName || ""}`.toLowerCase();
        if (!personName.includes(searchQuery.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [taxes, filterYear, filterStatus, searchQuery]);

  const formatMontant = (montant: number) => {
    return `${montant.toLocaleString("fr-FR")} Ar`;
  };

  const handleDelete = async (taxId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette taxe ?")) {
      await deleteTax.mutateAsync(taxId);
    }
  };

  const handleMarkAsPaid = async (taxId: number, amount: number) => {
    await markAsPaid.mutateAsync({ taxId, paidAmount: amount });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Taxes</h1>
          <p className="text-gray-600 mt-1">
            {filteredTaxes.length} taxe(s) sur {taxes.length}
          </p>
        </div>
        <Link
          href="/taxes/add"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nouvelle Taxe
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
            <input
              type="text"
              placeholder="Nom de la personne..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les années</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous</option>
              <option value="paid">Payées</option>
              <option value="unpaid">Impayées</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredTaxes.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">Aucune taxe trouvée</p>
            <Link
              href="/taxes/add"
              className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Ajouter une taxe
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Personne
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Année
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Payé
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTaxes.map((tax) => (
                  <tr key={tax.taxId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {tax.person?.firstName} {tax.person?.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {tax.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {tax.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                      {formatMontant(tax.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                      {formatMontant(tax.paidAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          tax.isPaid
                            ? "bg-green-100 text-green-800"
                            : tax.paidAmount > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tax.isPaid ? "Payée" : tax.paidAmount > 0 ? "Partiel" : "Impayée"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-2">
                        {!tax.isPaid && (
                          <button
                            onClick={() => handleMarkAsPaid(tax.taxId, tax.amount - tax.paidAmount)}
                            className="text-green-600 hover:text-green-700 p-1"
                            title="Marquer comme payée"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => router.push(`/taxes/${tax.taxId}/edit`)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Modifier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(tax.taxId)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Supprimer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredTaxes.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600">Total dû</p>
            <p className="text-xl font-bold text-gray-900">
              {formatMontant(filteredTaxes.reduce((sum, t) => sum + t.amount, 0))}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600">Total payé</p>
            <p className="text-xl font-bold text-green-600">
              {formatMontant(filteredTaxes.reduce((sum, t) => sum + t.paidAmount, 0))}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600">Reste à payer</p>
            <p className="text-xl font-bold text-red-600">
              {formatMontant(
                filteredTaxes.reduce((sum, t) => sum + (t.amount - t.paidAmount), 0)
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
