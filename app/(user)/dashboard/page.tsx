"use client";

import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePersons } from "@/hooks/usePersons";
import { useElecteursActifs } from "@/hooks/useVoter";
import { useTaxStats } from "@/hooks/useTax";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const { data: utilisateur, isLoading: isUserLoading } = useCurrentUser();
  const { data: persons = [], isLoading: isLoadingPersons } = usePersons();
  const { data: electeursData, isLoading: isLoadingElecteurs } = useElecteursActifs();
  const { data: taxStats, isLoading: isLoadingTaxStats } = useTaxStats();

  const isAdmin = utilisateur?.role === "admin" || utilisateur?.role === "ADMIN";

  const formatMontant = (montant: number) => {
    return `${montant.toLocaleString("fr-FR")} Ar`;
  };

  const stats = useMemo(() => {
    if (!persons) {
      return {
        totalPersons: 0,
        totalVoters: 0,
        totalNonVoters: 0,
        personsByGender: { male: 0, female: 0, other: 0 },
        personsByStatus: { active: 0, inactive: 0, pending: 0 },
        personsByNationality: [] as { nationality: string; count: number }[],
        recentRegistrations: 0,
      };
    }

    const totalPersons = persons.length;
    const totalVoters = persons.filter((p) => p.isVoter).length;
    const totalNonVoters = totalPersons - totalVoters;

    const personsByGender = {
      male: persons.filter(
        (p) =>
          p.gender?.toLowerCase() === "masculin" ||
          p.gender?.toLowerCase() === "male" ||
          p.gender?.toLowerCase() === "m"
      ).length,
      female: persons.filter(
        (p) =>
          p.gender?.toLowerCase() === "féminin" ||
          p.gender?.toLowerCase() === "feminin" ||
          p.gender?.toLowerCase() === "female" ||
          p.gender?.toLowerCase() === "f"
      ).length,
      other: persons.filter(
        (p) =>
          ![
            "masculin",
            "male",
            "m",
            "féminin",
            "feminin",
            "female",
            "f",
          ].includes(p.gender?.toLowerCase() || "")
      ).length,
    };

    const personsByStatus = {
      active: persons.filter(
        (p) =>
          p.status?.toLowerCase() === "active" ||
          p.status?.toLowerCase() === "actif"
      ).length,
      inactive: persons.filter(
        (p) =>
          p.status?.toLowerCase() === "inactive" ||
          p.status?.toLowerCase() === "inactif"
      ).length,
      pending: persons.filter(
        (p) =>
          p.status?.toLowerCase() === "pending" ||
          p.status?.toLowerCase() === "en_attente"
      ).length,
    };

    // Group by nationality
    const nationalityCounts: { [key: string]: number } = {};
    persons.forEach((p) => {
      const nat = p.nationality || "Non spécifié";
      nationalityCounts[nat] = (nationalityCounts[nat] || 0) + 1;
    });
    const personsByNationality = Object.entries(nationalityCounts)
      .map(([nationality, count]) => ({ nationality, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = persons.filter((p) => {
      if (p.createdAt) {
        return new Date(p.createdAt) >= thirtyDaysAgo;
      }
      return false;
    }).length;

    return {
      totalPersons,
      totalVoters,
      totalNonVoters,
      personsByGender,
      personsByStatus,
      personsByNationality,
      recentRegistrations,
    };
  }, [persons]);

  const genderChartData = useMemo(
    () => ({
      labels: ["Hommes", "Femmes", "Autres"],
      datasets: [
        {
          data: [
            stats.personsByGender.male,
            stats.personsByGender.female,
            stats.personsByGender.other,
          ],
          backgroundColor: [
            "rgba(59, 130, 246, 0.6)",
            "rgba(236, 72, 153, 0.6)",
            "rgba(156, 163, 175, 0.6)",
          ],
          borderColor: [
            "rgba(59, 130, 246, 1)",
            "rgba(236, 72, 153, 1)",
            "rgba(156, 163, 175, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }),
    [stats.personsByGender]
  );

  const voterChartData = useMemo(
    () => ({
      labels: ["Électeurs", "Non-électeurs"],
      datasets: [
        {
          data: [stats.totalVoters, stats.totalNonVoters],
          backgroundColor: [
            "rgba(16, 185, 129, 0.6)",
            "rgba(239, 68, 68, 0.6)",
          ],
          borderColor: ["rgba(16, 185, 129, 1)", "rgba(239, 68, 68, 1)"],
          borderWidth: 1,
        },
      ],
    }),
    [stats.totalVoters, stats.totalNonVoters]
  );

  const taxPaymentChartData = useMemo(
    () => ({
      labels: ["Payées", "Non payées"],
      datasets: [
        {
          data: [taxStats?.paidCount || 0, taxStats?.unpaidCount || 0],
          backgroundColor: [
            "rgba(16, 185, 129, 0.6)",
            "rgba(239, 68, 68, 0.6)",
          ],
          borderColor: ["rgba(16, 185, 129, 1)", "rgba(239, 68, 68, 1)"],
          borderWidth: 1,
        },
      ],
    }),
    [taxStats]
  );

  const taxByYearChartData = useMemo(
    () => ({
      labels: taxStats?.byYear?.map((y) => y.year.toString()) || [],
      datasets: [
        {
          label: "Total dû",
          data: taxStats?.byYear?.map((y) => y.total) || [],
          backgroundColor: "rgba(59, 130, 246, 0.6)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
        },
        {
          label: "Payé",
          data: taxStats?.byYear?.map((y) => y.paid) || [],
          backgroundColor: "rgba(16, 185, 129, 0.6)",
          borderColor: "rgba(16, 185, 129, 1)",
          borderWidth: 1,
        },
      ],
    }),
    [taxStats]
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  const taxChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += formatMontant(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return formatMontant(value);
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  if (isUserLoading || isLoadingPersons || isLoadingElecteurs) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-900">
            Chargement du tableau de bord...
          </div>
        </div>
      </div>
    );
  }

  if (!utilisateur) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-center">
          <p className="text-xl text-red-600 font-semibold mb-4">
            Utilisateur non connecté
          </p>
          <button
            onClick={() => (window.location.href = "/connexion")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Aller à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de Bord {isAdmin && "(Administrateur)"}
        </h1>
        <p className="text-gray-600">
          Bienvenue,{" "}
          <span className="font-semibold text-gray-800">{utilisateur.name}</span>
          {isAdmin && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Admin
            </span>
          )}
        </p>
      </div>

      {/* Stats Cards - Population */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Population</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Persons */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Personnes</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats.totalPersons}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Voters */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Électeurs</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats.totalVoters}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs text-gray-500">
                {stats.totalPersons > 0
                  ? `${((stats.totalVoters / stats.totalPersons) * 100).toFixed(1)}% de la population`
                  : "Aucune donnée"}
              </div>
            </div>
          </div>

          {/* Non-Voters */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Non-électeurs</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {stats.totalNonVoters}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inscriptions récentes</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {stats.recentRegistrations}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs text-gray-500">Dans les 30 derniers jours</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Taxes */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Taxes Annuelles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Taxes */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Taxes</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {taxStats?.totalTaxes || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Montant Total Dû</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {formatMontant(taxStats?.totalAmount || 0)}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Paid */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Montant Payé</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {formatMontant(taxStats?.totalPaid || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs text-gray-500">
                {taxStats?.paidCount || 0} taxes payées
              </div>
            </div>
          </div>

          {/* Total Unpaid */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Montant Impayé</p>
                <p className="text-2xl font-bold text-red-600 mt-2">
                  {formatMontant(taxStats?.totalUnpaid || 0)}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs text-gray-500">
                {taxStats?.unpaidCount || 0} taxes impayées
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistiques détaillées</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gender Distribution */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Répartition par genre
            </h3>
            <div style={{ height: "250px" }}>
              {stats.totalPersons > 0 ? (
                <Doughnut data={genderChartData} options={doughnutOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>

          {/* Voters Distribution */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Statut électoral
            </h3>
            <div style={{ height: "250px" }}>
              {stats.totalPersons > 0 ? (
                <Doughnut data={voterChartData} options={doughnutOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>

          {/* Tax Payment Status */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Statut de paiement des taxes
            </h3>
            <div style={{ height: "250px" }}>
              {(taxStats?.totalTaxes || 0) > 0 ? (
                <Doughnut data={taxPaymentChartData} options={doughnutOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Aucune taxe enregistrée
                </div>
              )}
            </div>
          </div>

          {/* Tax by Year */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Taxes par année
            </h3>
            <div style={{ height: "250px" }}>
              {(taxStats?.byYear?.length || 0) > 0 ? (
                <Bar data={taxByYearChartData} options={taxChartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tax by Year Table */}
      {(taxStats?.byYear?.length || 0) > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Détail des taxes par année
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Année</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nb. Taxes</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Dû</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Payé</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Impayé</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Taux</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {taxStats?.byYear?.map((yearData) => (
                    <tr key={yearData.year} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {yearData.year}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-600">
                        {yearData.count}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">
                        {formatMontant(yearData.total)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-green-600 font-medium">
                        {formatMontant(yearData.paid)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-red-600 font-medium">
                        {formatMontant(yearData.unpaid)}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            yearData.total > 0 && yearData.paid / yearData.total >= 0.8
                              ? "bg-green-100 text-green-800"
                              : yearData.total > 0 && yearData.paid / yearData.total >= 0.5
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {yearData.total > 0
                            ? `${((yearData.paid / yearData.total) * 100).toFixed(0)}%`
                            : "0%"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => (window.location.href = "/persons")}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group hover:border-blue-300"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Gérer les Personnes</h3>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">Consulter et gérer les personnes</p>
          </button>

          <button
            onClick={() => (window.location.href = "/isvoter")}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group hover:border-green-300"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Liste Électorale</h3>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">Gérer la liste des électeurs</p>
          </button>

          <button
            onClick={() => (window.location.href = "/persons/create")}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group hover:border-purple-300"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Nouvelle Inscription</h3>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">Enregistrer une nouvelle personne</p>
          </button>

          <button
            onClick={() => (window.location.href = "/taxes")}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group hover:border-red-300"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Gérer les Taxes</h3>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">Gérer les taxes annuelles</p>
          </button>
        </div>
      </div>
    </div>
  );
}
